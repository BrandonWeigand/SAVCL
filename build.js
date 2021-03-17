var DATE = new Date;
var build = {
    demo:false,
    componets:{},
    formats:{
        "LICENCE":true,
        "HTML":true,
        "README":true
    },
    envs:{
        "ID":"406a923tr4",
        "OWNER":"Brandon Weigand",
        "LICENCE_URL":"https://github.com/BrandonWeigand/SAVCL/",
        "MIN":0,
        "MAX":9999,
        "YEAR":DATE.getFullYear()
    },
    defs:{},
    files:['./componets/header.json','./componets/warrenty.json'],
    errors:[]
}
build.run=async function(builddata={}){
    build=Object.assign(build,builddata);
    // load in all the files
    let _await = [];
        for(let i in build.files){
            if(typeof(build.files[i])=='string'){
                console.log('loading...',build.files[i]);
                _await.push(build.file.get(build.files[i]));
            }
        }
    await Promise.all(_await).then(function (sucsess) { 
        console.log('... files loaded',sucsess.length);
    }).catch(function(err){
        build.errors.push("build.run failed on file load",err);
    });
    
    // strip the tags from all the values
    build.file.strip();

    // sort the file componets
    build.file.sort('order',true);

    return(build);
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
    get_demodata:async function(filekey=''){
        //console.log(filekey);
        let demodata = {// some duplicat data for testin only -- remove eventually
            './componets/header.json':{
                "title":"SOFTWARE LICENCE AND LICENCE TERMS",
                "order":"<%<!MIN!>%>",
                "content":[
                    "SAVCL License <!ID!>",
                    "A copy of this License can be found at <!LICENCE_URL!>",
                    "Copyright (c) <!YEAR!> <!OWNER!>",
                    "All rights reserved"
                ],
                "defs":{
                    "":[
                        "LOCAL AREA",
                        "LICENCE AGREMENT",
                        "LAW"
                    ],
                    "MEMBER":[
                        "a group of one or more of the following",
                        "<@AUTHOR@>, <@COPYRIGHT HOLDER@>, <@CONTRIBUTER@>, <@DISTRIBUTER@> and <@AFFILIATE@>"
                    ],
                    "YOU":[""],
                    "LICENCE":[""],
                    "SOFTWARE":[""]
                }
            },
            './componets/warrenty.json':{
                "title":"AGREMENT TO USE AT YOUR OWN RISK AND WITHOUT WARRANTY",
                "order":"<%<!MAX!>-1%>",
                "content":[
                    "This software is provided \"AS IS\", without any kind of warranty or guarantee, express, implied or otherwise.",
                    "<@MEMBERS@> are not liable for damages, claims or other liabilities witch may arise from use, connection or intended causation of this <@SOFTWARE@> or interactions with <@MEMBERS@> in relation, connection or assosiation to this <@SOFTWARE@>.",
                    "<@YOU@> assume any cost, damages, and/or liabilities that arise from use, connection or intended causation of this <@SOFTWARE@> under all cercemstances, even if one or more <@MEMBERS@>.",
                    "This <@LICENCE AGREMENT@> is limited to the maximum extent permitted by the <@YOUR@> <@LOCAL AREA@>'s <@LAW@>s."
                ],
                "defs":{
            
            
                    "":[
                        "LOCAL AREA",
                        "LICENCE",
                        "LICENCE AGREMENT",
                        "LAW",
                        "YOU",
                        "AUTHORs, COPYRIGHT HOLDERs, CONTRIBUTERs, DISTRIBUTERs and AFFILIATEs"
                    ],
                    "SOFTWARE":[""]
                }
            }
        };
        if(typeof(demodata[filekey])=='undefined'){
            file=filekey;
        }else{
            file=JSON.stringify(demodata[filekey]);// strinify so it is the same as if it was fetched
        }

        return(file);

    },
    get:async function(file="./componets/header.json"){
        let file_id=build.files.indexOf(file);
        // get a file from the url
        
        if(!build.demo){
            file = await fetch(file).then(response => {return response.json();});
        }else{
            file= await build.file.get_demodata(file);
        }

        // parse the filedata
        //console.log(file);
        try{file = (JSON.parse(file));}
        catch{file=file;}
        
        // store it in an array
        if(file_id==-1){
            file_id = build.files.length;
            build.files.push(file);
        }else{
            build.files[file_id]=file;
        }

        // return file id
        return(file_id);
    },
    sort:function(by='order',reverse=false){
        try{
            build.files=build.files.sort(function (a,b) {
                let r = 0;
                 switch(by){
                    case'order':{
                        r=((typeof(a)=='string'?-1:1)-(typeof(b)=='string'?1:-1));
                        if(r==0&&typeof(a)!='string'&&typeof(b)!='string'){
                         r=((typeof(a['order'])=='number'?a['order']:0)-(typeof(b['order'])=='number'?b['order']:0));
                        }
                    }break;
                    default:{r=((JSON.stringify(a)>JSON.stringify(b))?1:-1);}break;
                }
                return(r*(reverse?1:-1)); 
             });
             return(true);
        }catch{
            build.errors.push('Unable to sort file function');
            return(false);
        }
    },
    strip:function(){// run the tag strip on all the values
        //try{
            for(let file in build.files){
                //console.log('..',file);
                switch(typeof(build.files[file])){
                    case"string":{
                        build.files[file]=build.tag.strip(build.files[file]);
                    }break;
                    case"object":{
                        
                        // strip the title
                        try{
                            if(typeof(build.files[file].title)=='string'){build.files[file].title=build.tag.strip(build.files[file].title);};
                        }catch{
                            build.errors.push("UNABLE to strip file title of tags");
                        }

                        // strip the order
                        try{
                            if(typeof(build.files[file].order)=='string'){build.files[file].order=build.tag.strip(build.files[file].order);};
                        }catch{
                            build.errors.push('UNABLE to strip file order tags');
                        }

                        // strip the content
                        try{
                            if(typeof(build.files[file].content)=='object'){
                                for(i in build.files[file].content){
                                    if(typeof(build.files[file].content[i])=='string'){build.files[file].content[i]=build.tag.strip(build.files[file].content[i]);}
                                }
                            }
                        }catch{
                            build.errors.push('Unable to strip content tags');
                        }
                        
                        //  strip the definitions
                        try{
                            if(typeof(build.files[file].defs)=='object'){
                                //console.log(build.files[file].defs);
                                for(i in build.files[file].defs){
                                    //console.log('>>>',build.files[file].defs[i],i);
                                    if(typeof(build.defs[i])=="undefined"){
                                        build.defs[i]=["undefined"];
                                    }
                                    if(typeof(build.files[file].defs[i])=='object'){
                                        for(x in build.files[file].defs[i]){
                                            
                                            build.files[file].defs[i][x]=build.tag.strip(build.files[file].defs[i][x]);
                                            //console.log(x,build.files[file].defs[i][x]);
                                        }
                                    }
                                }
                            }
                        }catch{
                            build.errors.push('Unable to strip definition tags');
                        }   
                           
                    }break;
                    default:{}break;
                }
            }
            return(true);
        //}catch{
        //    build.errors.push('unable to strip tags from files');
        //    return(false);
        //}
    },
    merge:function(){// return an object of all the file data merged

    }
};
build.tag={
    env:function (key=''){// return the var or the sent in key
        key=key.toUpperCase();
        if(typeof(build.envs[key])!='undefined'){
            return(build.envs[key]);
        }else{
            build.errors.push(`${key} enviroment var is not set`);
            return(key);
        }
    },
    def:function (key=''){// return the the uppercase key on failue
        key=key.toUpperCase();
        if(typeof(build.defs[key])=='undefined'){
            build.defs[key]=["undefined"];
        }
        return(key);
    },
    opr:function(opr=''){// porform operations
        // just do eval for now
        try{
            return(eval(`${opr}`));
        }catch{
            build.errors.push('Unable to eval '+opr.toString());
            
        }
        return(opr);
    },
    ref:function(ref=''){// expand this later
        return(ref.toUpperCase());
    },
    and:function(and=''){// expand this later
        return(and.toUpperCase());
    },
    col:function(col=''){// expand this later
        return(col.toUpperCase());
    },
    strip:function(tag=''){// strip the tags from a string and return it
        // adding more try + catch because this script is the place i thing there will be the most input errors
        try{
            let keys = Object.keys(build.tag.list);
            keys=keys.sort(function(a,b){
                return(a[3]??0-b[3]??0);
            });
            for(let t in keys){
                t=keys[t];
                try{
                    let reg = new RegExp(`${build.tag.list[t][0]}([A-Za-z0-9]([A-Za-z0-9_\\s])*)${build.tag.list[t][1]}`,'g');
                    let matches = tag.matchAll(reg);
                    for( match of matches){
                        try{
                            let replace = build.tag.list[t][2](match[1]);
                            tag=tag.replace(match[0],replace);
                        }catch{
                            build.errors.push(`Critical ERROR in build.tag.strip > replace ${replace}`)
                        }
                    }
                }catch{
                    build.errors.push(`Critical ERROR in build.tag.strip(${t})`)
                }
            }
        }catch{
            build.errors.push(`Critical ERROR in build.tag.strip(${tag})`);
        }
        return(tag);
    }

};
build.tag.list={
    // open tag, close tag, function
    env:["<!","!>",build.tag.env,0],// get a ENViroment variable
    def:["<@","@>",build.tag.def,1],// get a DEFinition anchor
    opr:["<%","%>",build.tag.opr,5],// get a OPeRation emulation -- operations should be preformed last so we can nest other tags in the opr tag
    ref:["<#","#>",build.tag.ref,2],
    and:["<&","&>",build.tag.and,3],
    col:["<:",":>",build.tag.col,4]
};
build.add={
    def:function(key='',def=[]){// add a definition or append it to an existing definition returs bool of new definition or null on error
        key=key.toUpperCase();
        try{
            if(typeof(build.defs[key])=='undefined'){
                build.defs[key]=defs;
                return(true);
            }else{
                build.defs[key]=build.defs[key].concat(def);
                return(false);
            }
        }catch{
            return(null);
        }
    },
    comp:function(key=''){// add a componet to the build list, returns bool of is new entry or null on error
        // make all the componets relitive to the componet folder
        // make all the componets json only
        key="./componets/"+key.replace(/^.*(\/|\\)+/,'').replace(/\..*/g,'')+".json"; 
        try{
            if(build.componets.includes(key)){
                return(false);
            }else{
                build.componets.push(key)
                return(true);
            }
        }catch{
            return(null);
        }
    }//vars:fucntion
};
build.render={
    plain:{
        run:async function(){// returns a plain text object of the rendered content
            let text = "";
            await build.run().then(function(b){build=b;});
            for(f in build.files){

                if(typeof(build.files[f].title)=="string"){
                    console.log('build.title=',build.files[f].title)
                    text+=`\n\n\t${build.files[f].title}\n\n`;
                }else{
                    build.errors.push('build file dosn`t have a title: '+f);
                }

                if(typeof(build.files[f].content)!="undefined"){
                    console.log('build.content=',build.files[f].content)
                    for(c in build.files[f].content){
                        console.log('NEW LINE --- ',build.files[f].content);
                        text+=`${build.files[f].content[c]}\n`;
                    }
                }else{
                    build.errors.push('build file dosn`t have a content: '+f);
                }

            }

            // do the definitions
            text += `\n\n\tDEFINITIONS\n\n`;
            for(i in build.defs){
                text+=`\n\t[${i}]:`;
                for(d in build.defs[i]){
                    text += `\t${build.defs[i][d]}`;
                }
                text+=`\n`;
            }

            return(text);
        },
    }
};
async function test(){
    
    await build.render.plain.run().then(function(text){
        let target = document.getElementById('doc');
        console.log('"',text,'"   ','>>>> ',target);
        target.value = text;
    });
    
    return(true);
}
