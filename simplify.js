//
//Convert the (static) service labeled by the given target to a dynamic version
//
//  statements = [{label, service}, ...] 
//  
//where the key is a service label and and service is one of the
//has the following structures:-
//
//{type, exp} where exp is any valid javascript ;
//
//The following types of service are covered
//str
//branch
//while_
//
//Examples of converting sttaic to dynamic sevices
// {str:x} --> new service_input(x);
// {branch:services} --->new branch(@services);
// {while_:services}  --- new while @services);
//where @service is the dyamic version of a ststoc service
//
//Get teh service corresponding to the given target.
function simplify(target, vtargets,ventities, statements){
    //
    //Find the target $statement(from the given list);
    const $statement = statements.find(stmt => {
       //
       //Get the service with a lable 
       return stmt.label === target;
    });
    //
    //Verify that the target was found.
    if($statement===undefined) throw new Error("Target not found");
    //
    //Target found. Activate the (static) service associated with the sttaement.
    //(Note. Target is still needed for testing of cyclic conditions, see??)
    $aservice =  activate_service($statement.service, target, statements, vtargets,ventities);
    //
    //Return the active service
    return $aservice;
}

//Activate the given given static service with dynamic version. The structure of
//a stgtsic serice is {type, ...others} The others depend on the type of service
function activate_service(sservice0, target0, statements, vtargets, ventities){
    //
    //Get the type of the static service and activate it accordingly
    switch(sservice0.type){
         //
         case 'string':
            //
            //Get the service value.
            const value = sservice0.value;
            //
            //Acttivate the service to get the $aservice
            return new service_input(value);
         //
         case "branch":
            //
            //Test for cyclic looping..
            //
            //Check if current target is already visited, see 
            const found = vtargets.includes(target0);
            //
            //If it is, you are in an endless loop; throw an error.
            if(found){
                //
                //Throw an error.
                throw new Error(`Cyclic Word Found:${target0}`);
            }
            //
            //Extract the value.
            const {services:children} = sservice0;
            //
            //Activat each service for the branch.
            aservices =  children.map(sservice1=>activate_service(sservice1, target0, statements, [target0, ...vtargets], ventities));
            //
            //Activate the branch service, using the labe of the branch as the siganture.
            return new branch(target0, aservices);
        //
        //This is a case of simplification by substititution
        case "symbol":
            //
            //Deconstruct the service obejct to get the new target.
            const {name} = sservice0;
            //
            //Set the new target.
            const target2 = name;
            //
            //Set the target to the symbole.
            const aservice =  simplify(target2, vtargets,ventities, statements);
            //
            //Return the activated service.
            return aservice;
        case "entity":
            //
            //Descrtruture the incoming service.
            const {ename} = sservice0;
            //
            //Push the current entity name to the veneties.
            ventities.push(ename);
            //
            //Clean the opening and closing double quotes
            const local_services = get_local_services(ename.replace(/["]+/g, ''),ventities);
            //
            //Return a new entity object. 
            return new service_entity(ename, [...local_services]);
            
        case "while":
            //
            //Extract the value.
            const wservices = sservice0.services;
            //
            //Activat each service for the branch.
            aservices =  wservices.map((sservice)=>activate_service(sservice,target0, statements, vtargets,dbase));
            //
            //Compile the signature and the body of the wil from the service.
            const signature = sservice0.signature;
            //
            //Return a new entity object. 
            return new service_while_(signature,aservices);
        case "select":
            //
            //extract the value.
            const lservices = sservice0.options;
            //
            //Activat each service for the branch.
            aservices =  lservices.map(sservice=>activate_service(sservice,target0, statements, vtargets,dbase));
            //Return a new entity object. 
            return new service_select(target0,aservices);
        case "attribute":
            //
            //Extract the value.
            const atservices = sservice0.service;
            //
            //Compile the signature and the body of the wil from the service.
            let table = sservice0.ename;
            //
            //Compile the body.
            const attribute = sservice0.attribute;
            //
            //Compile the supporting data.
            const support = sservice0.support_data;
            //
            //Return a new entity object. 
            return new service_attribute(table,attribute,support);
        case "entity_select":
            //
            //Get the ename.
            const table_name = sservice0.ename;
            //
            //Push the current name to the visted entiti list.
            ventities.push(table_name);
            //
            //Get the options.
            const options = sservice0.options;
            //
            //Get the service from the options.
            const local_options = get_local_options(options, statements, ventities);
            //
            //Create a new switch object for the options.
            const service_switch = new switch_(table_name, local_options);
            //
            //Return a new service entity with the follow up data.
            return new service_entity(table_name,[service_switch]);
    }
}
//
//Returns a array of local services. Local; service are dified as all the 
//attributes of each enitity combine with any other entity used as an foreing key.
function get_local_services(ename1, ventities) {
    //
    const aservices = [];
    //
    //Get the entity with the name client.
    const entity = dbase.entities[ename1];
    //
    //Get the columns for the entitie.
    const columns = entity.columns;
    //
    //Create an new array out of the object 
    const new_columns = Object.values(columns);
    //
    //Step through all the colums and test fofr the type.
    for(let i = 0; i < new_columns.length; i++){
        //
        //Get the ith column.
        const column = new_columns[i];
        //
        //Switc through the columns and using the type expand all the other attributes.
        switch(column.type){
            //
            //Test for each case.
            case 'foreign':
                //
                //Get the new ename. This is from the foreing table name.
                const ename2 = column.ref_table_name;
                //
                let followups;
                //
                //Check if the foreing key has already been vistsited.
                if(ventities.includes(ename2)){
                    //
                    //Do nothing.
                    break;
                }else{
                    //
                    //Get thelocal service for the new ename.
                    followups = get_local_services(ename2,ventities);
                }                
                //
                //Create a new service entity for new ename
                const entity2 = new service_entity(ename2, followups);
                //
                //Push the service to the externla array.
                aservices.push(entity2);
                //
                break;
            case 'attribute':
                //
                //Create and push the new service to the external array.
                aservices.push(new service_attribute(column.name));
            break;
            //
            //We do nothing for the defaut case.
            default:;
        }
    };
    //
    //Return serives of this entity, attributes as simple inpurs and foreign keys
    //as branches
    return aservices;
}
//
//Retunrs an array of service and their titles.
function get_local_options(options,statements,ventities){
    //
    //start with an empty list of service_options
    const service_options = [];
    //
    //Step thorught the options anf for each set it name and create a new array.
    options.forEach(option => {
        //
        //Simplify the option to a service.
        const service = activate_service(option,'',statements,[], ventities);
        //
        //Create a service array with the
        service_options.push([option.ename,option.ename, service]);
    });
    //
    //return the generated service.
    return service_options;
}


