var result = zdjl.recognitionScreen({
    recognitionArea: { left: '20%', top: '10%', right: '70%', bottom: '50%' },
    recognitionMode: 'ocr_local',
  });
var zhixing = {
    zdjl:async function(){
        if(result.includes("荷花")){
            zdjl.toast('荷花村');
            //await ui.show(zdjl,'curStartCity'); 
            await shute.goFar(zdjl,null,{city:'姑苏',x:32,y:25},false);
        }else if(result.includes("虎丘")){
            zdjl.toast('虎丘山');
            await shute.goFar(zdjl,null,{city:'姑苏',x:3,y:3},false);
        }else if(result.includes("寒山")){
            zdjl.toast('寒山寺');
            await shute.goFar(zdjl,null,{city:'姑苏',x:38,y:12},false);
        }
    }
}

zdjl.click('98%', '66%'); 

setTimeout(() => {
    zhixing.zdjl();
}, 1000);
