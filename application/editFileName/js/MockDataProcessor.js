
class MockDataProcessor {

    /**
     * @param {Object} patientResponse - 患者接口返回的完整JSON对象
     * @param {Object} deviceResponse  - 设备接口返回的完整JSON对象（可选，仅患者模式可不传）
     */
    constructor(patientResponse, deviceResponse) {
        this.patientResponse = patientResponse;
        this.deviceResponse = deviceResponse;
        this.patientList = [];
        this.deviceList = [];
        this._parse();
    }

    _parse() {
        if (this.patientResponse && this.patientResponse.data && this.patientResponse.data.patientSelectDtos) {
            this.patientList = this.patientResponse.data.patientSelectDtos;
        }
        if (this.deviceResponse && this.deviceResponse.data && this.deviceResponse.data.list) {
            this.deviceList = this.deviceResponse.data.list;
        }
    }

    validate() {
        if (!this.patientList.length) {
            return { valid: false, message: '患者数据为空' };
        }
        if (this.deviceList.length) {
            const deptId1 = this.patientList[0].patientIn.deptId;
            const deptId2 = this.deviceList[0].deptId;
            if (deptId1 !== deptId2) {
                return { valid: false, message: '科室不一样' };
            }
        }
        return { valid: true };
    }

    /**
     * 获取所有可匹配的床位列表（设备与患者通过 bedName 匹配）
     * @returns {Array<{bedName: string, patientName: string, patientIn: Object, deviceInfo: Object|null}>}
     */
    getMatchedBeds() {
        const result = [];
        for (const device of this.deviceList) {
            const patient = this.patientList.find(p => p.patientIn.bedName === device.bedName);
            if (!patient) continue;
            result.push({
                bedName: patient.patientIn.bedName,
                patientName: patient.patientIn.patientName,
                patientIn: patient.patientIn,
                patientInfoDtos: patient.patientInfoDtos || [],
                nurseLevelConfig: patient.nurseLevelConfig || null,
                deviceInfo: device
            });
        }
        return result;
    }

    /**
     * 根据 bedName 构造提交给 /yh-mock/create-files 的请求数据
     * @param {string} bedName
     * @param {string} deviceType - 'wnBedHeadExtension' | 'wnBedSideExtension'
     * @returns {Object} requestData
     */
    buildRequestData(bedName, deviceType) {
        const patient = this.patientList.find(p => p.patientIn.bedName === bedName);
        const device = this.deviceList.find(d => d.bedName === bedName && d.deviceType === deviceType);

        if (!patient || !patient.patientIn) {
            throw new Error(`未找到 bedName=${bedName} 对应的患者数据`);
        }

        const patientIn = patient.patientIn;

        const deviceInfo = device
            ? this._buildDeviceInfoFromDevice(device)
            : this._buildDeviceInfoFromPatient(patientIn);

        const patientInfo = this._buildPatientInfo(patientIn);

        return {
            getDeviceInfosdk: JSON.stringify(deviceInfo),
            getOrgIdsdk: JSON.stringify({ orgId: patientIn.orgId }),
            getPatientInfosdk: JSON.stringify(patientInfo)
        };
    }

    /**
     * 批量构造所有匹配床位的请求数据
     * @param {string} [deviceType] - 指定设备类型，不传则匹配所有
     * @returns {Array<{bedName: string, patientName: string, requestData: Object}>}
     */
    buildAllRequestData(deviceType) {
        const results = [];
        for (const device of this.deviceList) {
            if (deviceType && device.deviceType !== deviceType) continue;
            const patient = this.patientList.find(p => p.patientIn.bedName === device.bedName);
            if (!patient) continue;
            try {
                const requestData = this.buildRequestData(device.bedName, device.deviceType);
                results.push({
                    bedName: device.bedName,
                    patientName: patient.patientIn.patientName,
                    deviceType: device.deviceType,
                    requestData
                });
            } catch (e) {
                console.warn(`跳过 bedName=${device.bedName}: ${e.message}`);
            }
        }
        return results;
    }

    /**
     * 仅根据患者列表生成请求数据（不需要设备数据）
     * @returns {Array<{bedName: string, patientName: string, requestData: Object}>}
     */
    buildRequestDataFromPatientsOnly() {
        return this.patientList.map(item => {
            const patientIn = item.patientIn;
            const deviceInfo = this._buildDeviceInfoFromPatient(patientIn);
            const patientInfo = this._buildPatientInfo(patientIn);
            return {
                bedName: patientIn.bedName,
                patientName: patientIn.patientName,
                requestData: {
                    getDeviceInfosdk: JSON.stringify(deviceInfo),
                    getOrgIdsdk: JSON.stringify({ orgId: patientIn.orgId }),
                    getPatientInfosdk: JSON.stringify(patientInfo)
                }
            };
        });
    }

    _buildDeviceInfoFromDevice(device) {
        return {
            BED_ID: device.bedId,
            BED_NAME: device.bedName,
            DEPT_ID: device.deptId,
            DEPT_KEY: "",
            DEPT_NAME: device.deptName,
            DEVICE_APP_ID: device.deviceAppId,
            DEVICE_BRIGHTNESS: device.brighter,
            DEVICE_ID: device.deviceId,
            DEVICE_NAME: device.deviceName,
            DEVICE_NUM: device.deviceNum,
            DEVICE_VOLUME: device.volume,
            ROOM_ID: device.roomId,
            ROOM_NAME: device.roomName,
            ROTATE: device.rotate
        };
    }

    _buildDeviceInfoFromPatient(patientIn) {
        return {
            BED_ID: "ec89a1299d0646b78544659ae419a351",
            BED_NAME: patientIn.bedName,
            DEPT_ID: patientIn.deptId,
            DEPT_KEY: "",
            DEPT_NAME: patientIn.deptName || "",
            DEVICE_APP_ID: "34d6dc89a804f7c4",
            DEVICE_BRIGHTNESS: 0,
            DEVICE_ID: "028a9f1ef5ec481ea893e8434cfa9f93",
            DEVICE_NAME: "1",
            DEVICE_NUM: "1",
            DEVICE_VOLUME: 10,
            ROOM_ID: "6bba5f0762ce463d994fc55d8538a44b",
            ROOM_NAME: "1",
            ROTATE: 0
        };
    }

    _buildPatientInfo(patientIn) {
        return {
            bedName: patientIn.bedName,
            birthday: patientIn.birthday,
            doctorName: patientIn.doctorName,
            inTime: patientIn.inTime,
            inpNo: patientIn.inpNo,
            nurseName: patientIn.nurseName,
            patientAge: patientIn.patientAge,
            patientId: patientIn.patientId,
            patientName: patientIn.patientName,
            personIdNo: patientIn.personIdNo,
            sex: patientIn.sex,
            wristband: patientIn.wristband
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = MockDataProcessor;
}
