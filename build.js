var DATE = new Date;
var build = {
    "componets":[
        "header",
        "warrenty"
    ],
    "formats":{
        "LICENCE":true,
        "HTML":true,
        "README":true
    },
    "vars":{
        "ID":"406a923tr4",
        "OWNER":"Brandon Weigand",
        "LICENCE_URL":"https://github.com/BrandonWeigand/SAVCL/",
        "MIN":0,
        "MAX":9999,
        "YEAR":DATE.getFullYear()
    },
    "files":[]
}
build.run=function(builddata={}){
    builddata=Object.apply(build,builddata);
}
build.format={
    LICENCE:function(builddata={}){

    },
    HTML:function(builddata={}){

    },
    README:function(builddata={}){

    }
};
build.file={
    get:function(file_url){
        // get a file from the url
        url="./componets/header.json";

        fetch(url)
        .then(response => {
            return response.json();
        })
        .then(data => console.log(data));
        
        // parse the filedata

        // store it in an array
        
        // return file id
    },
    sort:function(by='order',reverse=false){

    },
    merge:function(){// return an object of all the file data merged

    }
};