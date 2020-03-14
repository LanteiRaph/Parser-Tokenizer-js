class scanner {
    //
    //Tokeniz the given string to single tokens for parsing.
    scan(str){
        //
        //Break the input string into tokens. A match has the following format:-
        //[{token, index, value}, ...]
        //where value is the matched stirng and token is object type and index is the positiion where tyhe token was
        //found
        let dirty_matches = this.tokenize(str, tok.tokens);
        //
        //Remove any space, comment from the match.
        const matches = dirty_matches.filter(match => {
            //
            const {token}=match;
            //
            //Return all now space and comment tokens.
            return  token.constructor !== tok.multilinecomment.constructor &&
                    token.constructor !== tok.comment.constructor &&
                    token.constructor !== tok.procomment.constructor &&
                    token.constructor !== tok.space.constructor;
        });
        //
        //Return the match.
        return matches;
    }
    //
    //Excute a regular exprssion agaist the input string to generate tokens.
    tokenize(str) {
        //
        //Start with in empty output.
        let output = [];
        //
        //Declare the last index.
        let lastindex = 0;
        //
        //While the length is equal to the last index perfom an exectuion and 
        //append a match.
        while (lastindex < str.length) {
            //
            //Declare found.
            let found = false;
            //
            //Execute for all tokens and perfom extraction.
            for (let i = 0; i < tok.tokens.length; i++) {
                //
                //Get the current token.
                let token = tok.tokens[i];
                //
                //Let match be the executed return value from the current token.
                const match = token.exec(str);
                //
                //If match is found and the index equals the last index get the 
                //match token.
                if (match && match.index === lastindex) {
                    //
                    //Extract the values of the match found.
                    const index = match.index;
                    let value;
                    //
                    //Consiser diffrent types of tokens. Only a keyword doent 
                    //have a value property.
                    if(token.value === undefined){
                        //
                        //Set the token
                        value = token.name;  
                    }else{
                        //
                        //Set the value.
                        value = token.value;
                    }
                    //
                    //Push the yeild to the output.
                    output.push({token,index,match:value});
                    //
                    //Set the last index to the match value.
                    lastindex = token.lastIndex;
                    //
                    //Set found to true.
                    found = true;
                    //
                    //Break out of the loop.
                    break;
                }
            }
            //
            //If not found, throw an error.
            if (!found) {
                throw new Error(`Failed at index ${lastindex}`);
            }
            //
            //Update the last index of all tokens to the matched tokens.
            tok.tokens.forEach(token => {
                //
                //Set the last index to the last index.
                token.lastIndex = lastindex;
            });
        }
        //
        //Return the output generated.
        return output;
    }
}


