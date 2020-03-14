//Parse the text pointed by the given url to a list of static statements
async function  parse_url(url){
    //
    //Fetch the url
    const result =  await fetch(url);
    //
    //Extract the responce as text fro parsing.
    const text = await result.text();
    //
    //Create a new scanner.
    const Scanner = new scanner();
    //
    //Tokenize the input string.
    const tokens = Scanner.scan(text);
    //
    //Declare the expectedd result holder. services[....services];.
    const services_result = {};
    //
    //Test the parsing of the string to services. if sucessfull we transefr 
    //the output to the services array,check for the any remainigng tokens and die if any,
    //convert the services to dynamic object.
    if (parse_flow(tokens, services_result)){
        //
        //Destructure theh result
        const {directives , statements} = services_result;
        //Ok
        //
        //Return and object with all the service.
        return {directives, statements};
    }
    else{
        //
        //Deconstruct the service to retrive the error msg and index position.
        const {msg, index} = services_result;
        //Report error
        throw new Error(msg,index);
    }

}
//Parse the given tokens into a list of services.
//the expected output structure, services[...services];.
function parse_statements(input_tokens, services_result){
    //
    //Start with an empty list of services.
    services_result.services = [];
    //
    //Set the starting tokens to those of the input
    services_result.tail = input_tokens;
    //
    let error = false;
    //
    //Loop through all the tokens, to build services, until either the 
    //tokens are empty or there is an error.
    while(services_result.tail.length !== 0 && !error){
        //
        //Prepare to collect a service.
        const service_result = {};
        //
        //Parser all the token in the token list to a head service, i.e., single service 
        //and tail, i.e., all the remaing services.
        if(parse_statement(services_result.tail, service_result)){
            //
            //Deconstrut the service result to exctract the values needed.
            const {service,tail,label} = service_result;
            //
            //Push the service to the services array.
            services_result.services.push({label, service});
            //
            //Set the tail to remaining tokens.
            services_result.tail = tail;
            //
        }else{
            //
            //Deconstrut the service result.
            const {msg, index} = service_result;
            //
            //Set the error msg of the services result.
            services_result.msg = msg;
            //
            //Set the index.
            services_result.index = index;
            //
            //Error has occured set error to true and get out of the loop.
            error = true;
        };
    }
    //
    //Return the oposite of error i.e,. When error is false we know that we 
    //excuted and return true and vis verse
    return !error;
}
//Parse the given tokens to a service. The string structure of a service is, 
//'symbol = expression' and the required service as the structure {x:exp}.
function parse_statement(tokens, service_result){
    //
    //lable(Label) equal SERVICE semicolon->statment(Label, SSERVICE) 
    //
    //Destructure the input tokens to pick the first 2 rokens
    const [label, equal, ...rtokens1] = tokens;
    //
    //Match the leading token to a symbol; die if no match.
    if(!tok.label.match(label,service_result)) return false;
    //
    //Match the next token to a equal sign; bomb out if no matched.
    if(!tok.equal.match(equal,service_result)) return false;
    //
    //Prepare the output of the expression.
    const exp_result = {};
    //
    //Test for each expression
    if (!parse_service(rtokens1,exp_result)){
        //
        //Deconstrut the expression to extract the msg and index.
        const {msg, index} = exp_result;
        //
        //Set the service msg with the error msg.
        service_result.msg = msg;
        //
        //Set the index.
        service_result.index = index;
        //
        //Set the tail tokens to the incoming tokens.
        service_result.tail = tokens;
        
        //Process has faild, return false.
        return false;
    }
    //
    //Deconstruct the the output to obtain the append properties.
    const {service, tail} = exp_result;
    //
    //Destructure the tail to look for the terminating semicolon
    const [semi, ...rtokens2] = tail;
    //
    //Cnfirm that semi is a semiclonk
    if(!tok.semicolon.match(semi,service_result))return false;
    //
    //Set the label of the service.
    service_result.label  = label.match;
    //
    //Compile the serivece statement.
    service_result.service = service;
   //
    //Create the tail, i.e,. the remaing tokens.
    service_result.tail = rtokens2;
    //
    //The process has been successful.
    return true;
}
//
//parse a select expression type.
function entity_select(tokens, sel_result){
    //
    //Start off with an empty service list.
    sel_result.service = {};
    //
    //Deconstruct the tokens to obtain the firts element.
    const [select,lbracket,sym,comma,lsbracket, ...rtokens] = tokens;
    //
    //test for the type do "Do is a keyword".
    if(!tok.entity_select.match(select,sel_result)) return false;
    //
    //test for the bracket.
    if(!tok.lbracket.match(lbracket,sel_result)) return false;
    //
    //Test for the string.
    if(!tok.symbol.match(sym,sel_result)) return false;
    //
    //test for the comma.
    if(!tok.comma.match(comma,sel_result)) return false;
    //
    //Test for the left squere bracket.
    if(!tok.lsbracket.match(lsbracket, sel_result)) return false;
    //
    //Prepare the expression result.
    const service_result = {};
    //
    //Test for the parsering of expressions.
    if(!parse_options(rtokens,service_result)){
        //
        //Set the error reporting message.
        sel_result.msg = "Unsuccefull parsing of expressions.";
        //
        //Track the error position.
        sel_result.index = lbracket.index;
        //
        //faild to parse, return false.
        return false;
    }
    //
    //Deconstrut the expession resin to get the exp and the tail.
    const {options, tail} = service_result;
    //
    //Deconstct the tail to get right bracket.
    const [rsbracket,rbracket, ...rest] = tail.tail;
    //
    //test for the rsbracket
    if(!tok.rsbracket.match(rsbracket,sel_result)) return false;
    //
    //Test for the right bracket.
    if(!tok.rbracket.match(rbracket,sel_result)) return false;
    //
    sel_result.service = {type:'entity_select', ename:sym.match, options};
    //
    //Set the tail tokens of the output.
    sel_result.tail = rest;
    //
    //Process was successfull, return true.
    return true;
}
//Returns a result that incluses the branch expression.
//- exp has the structue {branch:[...members]};
function exp_branch(tokens,branch_result){
    /*
     lsbracket SERVICES rsbracket -> branch(SERVICES);
     */
    //
    //
    //Destructure the inoput tokens to a haead and tail.
    const [lsbracket, ...rtokens] = tokens;
    //
    //Test if the head is a left square bracket.
    if(!tok.lsbracket.match(lsbracket,branch_result)) return false;
    //
    //Create the results expected.
    const exps_result = {};
    //
    //Get the expresions match all the tail tokens. This is a procedure; it
    //cannot fail.
    if(!parse_services(rtokens ,exps_result)){
        //
        //Get and set the index for the ls
        branch_result.index = lsbracket.index;
        //
        //Set the tail of the result to the incoming tokens.
        branch_result.tail = tokens;
        //
        //Return false process faild.
        return false;
    };
    //
    //Deconstruct the expression results to obtain the exp and tail.
    const {services, tail} = exps_result;
    //
    //Deconstrut the tail to obtain it elements.
    const [rbracket, ...rest] = tail;
    //
    //Test for the closing square bracket.
    if(!tok.rsbracket.match(rbracket)) return false;
    //
    //Compile the output result.
    branch_result.service ={type:'branch', services};
    //
    //Set the tail of the bracnh to the rest.
    branch_result.tail = rest;
    //
    //process has been succefull return true.
    return true;
}
//
//Returns a a flow object with the directive if set and service statements.
function parse_flow(tokens, flow_result){
    //
    //FLOW = DIRECTIVES, STATEMENTS ->flow(DIRECTIVES, STATEMENTS)
    //
    //Parse the directives of the flow.
    if(parse_directives(tokens, flow_res = {})){
        //
        //Deconstruct the returned result to obtain the values.
        const{directives , tail} = flow_res;
        //
        //Set the directives of the flow.
        flow_result.directives = directives;
        //
        //Reset th tokens to the tail.
        tokens = tail;
    }
    //
    //Parse the statement.
    if(parse_statements(tokens, services_result={})){
        //
        //Destructure theh result
        const {services, tail} = services_result;
        //
        //Check whether all the inputs were parsed, i.e, the tail is empty
        if (tail.length!==0){
            //
            //Get the head token of the tail
            const index = tail[0].index;
            //
            //Report error.
            throw new parser_error('Incomplete parsing', index);
        }
        //Ok
        //
        //Compile the out put result.
        flow_result.statements = services;
        //
        //Set the tail of the output result.
        //
        //Return true.
        return true;
    }
    else{
        //
        //Deconstruct the service to retrive the error msg and index position.
        const {msg, index} = services_result;
        //Report error
        throw new Error(`${msg} at index ${index}`);
        //
        //Process has faild.
        return false;
    }
}
//
//Parse the given tokens to a directives
function parse_directives(tokens, dec_result){
    //
    //Decalere the expected output.
    dec_result.directives = [];
    //
    //Set the tail of the of the output.
    dec_result.tail = tokens;
    //
    //Set the error to false.
    let error = false;
    //
    //For as long and no error and the lenght og the tail is greater than zero.
    //Parse a single directive.
    while(dec_result.tail.length !== 0 && !error){
        //
        //Start with an empty result holder.
        const directive_res = {};
        //
        //Parse a single directive
        if(parse_directive(dec_result.tail, directive_res)){
            //
            //Deconstruct to gain value for the ouput.
            const {directive , tail} = directive_res;
            //
            //Push the rective to the output array.
            dec_result.directives.push(directive);
            //
            //Set the tail of the ouptu to the returned one.
            dec_result.tail = tail;
        }else{
            //
            //Test the length of the directives array if greater than zero.
            if(dec_result.directives.length !== 0){
                //
                //Return a true we found some directives.
                return true;
            }
            //
            //We don need to track the error for the directive they might 
            //be or might not be
            //Set the error to true, We have an error, We found no directives.
            error = true;
        }
    }
}
//Parse all the given tokens to a single expression;
//the expected output stucture, exp_result{exp:value,tail:value}
function parse_service(tokens,exp_result){ 
    //
    //This are functors of an expression.
    const functors = [
        'entity_select',
        'exp_label',
        'exp_branch',
        'exp_entity'
    ];
    //
    //Step throught all functors and execute each one of them agianst the input
    //tokens. If a match is found, set found to true and get out of the loop
    for(let i=0; i<functors.length; i++){
        //
        //Get the i'th functor.
        let functor = functors[i];
        //
        //Evalutethe functor from string to javascript variable.
        functor = eval(functor);
        //
        //Prepare the result container.
        const fun_result = {};
        //
        //Execute the functor.
        if(functor(tokens, fun_result)){
           //
           //Set stop and terminate the loop.
           const {service, tail} = fun_result;
           //
           //Set the expression for the output.
           exp_result.service = service;
           //
           //SEt the tail of theremaing tokens.
           exp_result.tail = tail;
           //
           //Process succefull, return true.
           return true;
        }
        //
        //Matching has failed. Track the index.
        //
        //Process has faild save the msg and index.
        const {msg, index} = fun_result;
        //
        //Push the msg to the error variable.
        if(fun_result.index > exp_result.index || exp_result.index === undefined){
            //
            //Set the error msg and index to the current one.
            exp_result.msg = msg;
            //
            //Set the index.
            exp_result.index = index;
        }
    }
    //
    //No match was found
    return false;
}
//Parse the given tokens into a list of comma separated expressions.
function parse_services(tokens,services_result){
    //
    //Create a local copy to iterate over, starting with the incoming tokens
    let input_tokens = tokens;
    //
    let error = false;
    //
    //Declare the mlocal array for each memebr of the branch.
    services_result.services = [];
    //
    //Start with stop being false. set to true once we 
    let stop = false;
    //
    //Loop until the input tokens are exhausted or there is an error
    while(!stop  && !error){
        //
        const service_result = {};
        //
        //Get the head (matching) expression and return the tail tokens.
        if(parse_service(input_tokens,service_result)){
            //
            let {service, tail} = service_result;
            //
            //Push the memeber to the memebrs.
            services_result.services.push(service);
            //
            //Reset the input tokens to the returned tail tokens
            let sep_result = {};
            //
            //Test for the separator if found rest the input tokens to its tail.
            if (separator(tok.comma, tail,  sep_result)){
                //
                //Deconstruct the reuslt to get the tail.
                let {tail} = sep_result;
                //
                //Reset the input token.
                input_tokens = tail;
            }else{
                //Set stop to true.
                stop = true;
                //
                //Set the outgoing result tail.
                services_result.tail = tail;
            };
        }
        else{
            //
            //Ceconstruct to obtain the error result.
            const {index, msg} = service_result;
            //Set the out coing error report.
            service_result.index =index;
            service_result.msg =msg;         
            error = true;
        }
    }
    //
    //The process is succesfull
    return !error;
}
//
function separator(test_separetor,in_tokens,sep_result){
    //
    //Start with an empty output.
    let output_token;
    //
    //Deconstrut the tokens to test for the fits.
    const [actual_seperator, ...remainder] = in_tokens;
    //
    //deconstruct the actual to obtain the token.
    const {token} = actual_seperator;
    //
    //Test if the first element.
    if(token.value !== test_separetor.value){
        //
        //Compile the msg to pass the the user.
        const msg = `Expected right square brack, found ${actual_seperator.value} at postion ${actual_seperator.index}`;
        //
        //Set the index for debugguin g aspect.
        const index = actual_seperator.index;
        //
        //Append the massege and index to the sep_result.
        sep_result.msg = msg;
        sep_result.index = index;
        //
        //Return true. sucess
        return false;
    }else if(in_tokens.length === 0){
        //
        //Return the in tokens.
        output_token = in_tokens;
        //
        //Return true.
        return true;
    }
    //
    //Set the output tokens to the remainder.
    sep_result.tail = remainder;
    //
    //return the output of th remainder.
    return true;
}

//parse the given tokens to options
function parse_options(tokens, opt_result){
    //
    //Pattern to match.
    //OPTIONS = lsbracket SYMBOLS rsbracket.
    //SYMBOLS = symbol(LABEL)+ comma separator
    //
    //Parse the options of the
    if(!parse_symbols(tokens,optn_result = {})) return false; 
    //
    //Deconstruct the outpu result to obtain value.
    const {options, ...rtokens} = optn_result;
    //
    //Apped the reuslt to the output result.
    opt_result.options = options;
    //
    //Set the tail tokens of the output result.
    opt_result.tail = rtokens;
    //
    //Process was succefull.
    return true;
}

//Parse the given services to a symbol service.
function parse_symbols(tokens, symbol_result){
    //
    //Let $stop be the terminating condition.
    let stop = false;
    //
    //Start with no error.
    let error = false;
    //
    //Start with an empty list of options.
    const options = [];
    //
    //Step through the tokens to extract a single option for the maybe more than one.
    while(!stop && !error){
        //
        //Extract on symbole.
        if(exp_entity(tokens, sym_result = {})){
            //
            //Deconsturct the returned result to obtain the values needed.
            const {service, tail} = sym_result;
            //
            //Puch the service to the options.
            options.push(service);
            //
            //Test for the comma sep.
            if(separator(tok.comma, tail, sep_result = {})){
                //
                //deconstruct the result.
                const {tail} = sep_result;
                //
                //Rest the tokens to this tail tokens.
                tokens = tail;
            }else{
                //
                //Set the output results.
                symbol_result.options = options;
                //
                //Set the tail of the output result.
                symbol_result.tail = tail;
                //
                //Set stop true.
                stop = true;
            }
        }else{
            //
            //Deconstruct to obtain the error massege.
            const {msg, index}  = sym_result;
            //
            //Set the output result error report.
            symbol_result.msg = msg;
            //
            //Set the index.
            symbol_result.index = index;
            //
            //Set error to true.
            error = true;
        }
    }
    //
    //Retunr true.
    return !error;
}
//
//Return a single directive.
function parse_directive(tokens, directive_res){
    //
    //Deconstuct the tokens to gan test values.
    const [directive, semicolon, ...rest] = tokens;
    //
    //Test the directive agaist the string.
    if(!tok.string.match(directive,directive_res))return false;
    //
    //Test for the semi colon.
    if(!tok.semicolon.match(semicolon, directive_res)) return false;
    //
    //Process is succesfull fetch the values.
    directive_res.directive = directive.match;
    //
    //Set the tail of the out put.
    directive_res.tail = rest;
    //
    //Return true to the process.
    return true;
}
//
//Parse a symbol to an entity.
function exp_entity(tokens, entity_result){
    //
    //General formulation
    //symbol(ENAME) ->entity(ENAME);
    //
    //Javascript formulation
    //symbol(ENAME) -> {type:'entity',  ename:ENAME}
    //
    //Deconstruct the tokens to obtain test values.
    const [symbol, ...rest] = tokens;
    //
    //Test for the type of symbol.
    if(!tok.symbol.match(symbol, entity_result))return false;
    //
    //Process succefull.
    entity_result.service ={type:'entity', ename:symbol.match};
    //
    //Set the tail emement of the outptu result.
    entity_result.tail = rest;
    //
    //Process suceful, return true.
    return true;
}
//
//Returns a symbol type expression, i.e,. {sym:value};
function exp_label(tokens,lb_result){
    //label(LABEL) -> symbol(LABEL);
    //
    //Deconstruct the tokens.
    const [label, ...tail] = tokens;
    //
    //Test if the sym is of type symbol any other type is not valid.
    if(!tok.label.match(label,lb_result)) return false;
    //
    //Declare the output service holder.
    lb_result.service = {type:'symbol', name:label.match};
    //
    //Set the tail of the result.
    lb_result.tail = tail;
    //
    //Process succed, return true.
    return true;
}