var tokens_ = null;
////
//Token to match.
class tok extends RegExp{
    //
    //Returns an instance of the token.
    constructor(pattern){
        //
        //Consturct the super constructor.
        super(pattern,'g');
    }
    
    match(tok){
        //
        //Return true if the constructor match. this is in case of all tokens.
        return tok.constructor === this.constructor;
    }
    //
    //Create all the charaters tokens to match.
    static get multilinecomment(){return new comment('\\*[\\s\\S]*?\\*');};
    static get comment(){return new comment('\\/\\/.*');};
    static get procomment(){return new comment('\%.*');};
    static get attr(){return new data_type("attribute",'\\"\\w+\\.\\w+\\"');};
    static get string(){return new data_type('string',`\\"(.+?)\\"`);};
    static get select(){return new keyword("select");};
    static get entity_select(){return new keyword("entity_select");};
    static get while_(){return new keyword("while_");};
    static get entity(){return new keyword("entity");};
    static get attribute(){return new keyword("attribute");};
    static get float(){return new data_type('float',"[-+]\\d+\\.\\d+");};
    static get int(){return new data_type("int","\\d+");};
    static get label(){return new data_type("label", "\\b[A-Z]+[a-zA-Z]*\\b");};
    static get symbol(){return new data_type("symbol",'\\w+');}; 
    static get equal(){return new char("=");};
    static get rsbracket(){return new char ("]");};
    static get lsbracket(){return new char("[");};
    static get comma(){return new char(",");};
    static get lbrace(){return new char("{");};
    static get rbrace(){return new char("}");};
    static get rbracket(){return new char(")");};
    static get lbracket(){return new char("(");};
    static get arrow(){return new char("->");};
    static get minus(){return new char("-");};
    static get plus(){return new char("+");};
    static get divide(){return new char("/");};
    static get times(){return new char("*");};
    static get and(){return new char("&");};
    static get ateach(){return new char("@");};
    static get percent(){return new char("%");};
    static get dollar(){return new char("$");};
    static get harsh(){return new char("#");};
    static get exclamation(){return new char("!");};
    static get semicolon(){return new char(";");};
    static get colon(){return new char(":");};
    static get space(){return new space("s");};
    //
    //Compile the tokens.
    static get tokens(){
        //
        if (tokens_!==null) return tokens_;
        //
        tokens_ = [
            tok.multilinecomment,
            tok.comment,
            tok.procomment,
            tok.attr,
            tok.label,
            tok.string,
            tok.while_,
            tok.entity,
            tok.select,
            tok.entity_select,
            tok.attribute,
            tok.float,
            tok.int,
            tok.symbol,
            tok.lbrace,
            tok.rbrace,
            tok.comma,
            tok.lsbracket,
            tok.rsbracket,
            tok.equal,
            tok.arrow,
            tok.minus,
            tok.plus,
            tok.lbracket,
            tok.rbracket,
            tok.divide,
            tok.times,
            tok.and,
            tok.ateach,
            tok.percent,
            tok.harsh,
            tok.dollar,
            tok.exclamation,
            tok.colon,
            tok.semicolon,
            tok.space
        ];
        //
        return tokens_;
    } 
}
//
//A charachter is any.... that is match.
class char extends tok{
    //
    //Called on instaciation, eturns an instance.
    constructor(value){
        //
        const pattern = `\\${value}`; 
        //
        //Construct the parent.
        super(pattern);
        //
        //Set the value property.
        this.value = value;
    }
    //
    //Returns true is the value of the charature match the given token.
    match(tokens, result){
        //
        //Deconstruct the tokens to obtain value for testing
        const {token} = tokens;
        //
        //Test for  the match of the value aganist the toekn.
        if(super.match(token) && token.value === this.value){
            //
            //They match, return true.
            return true;
        }
        //
        //Compile the error massege.
        result.msg = `Expected ${this.value}`;
        //
        //Set the index position.
        result.index = token.index;
        //
        //Rerune false.They don't match.
        return false;
        
    }
}

//A key word is any special word for the current scanning.
class keyword extends tok{
    //
    //Returns an instsnce.
    constructor(name){
        //
        //Compile the pattern.
        const pattern = `\\b${name}\\b`;
        //
        //Consturct the parent.
        super(pattern);
        //
        //Set the name property.
        this.name = name;
    }
    //
    //Returns true is the value of the charature match the given token.
    match(tokens, result){
        //
        //Deconstruct the tokens to obtain value for testing
        const {token} = tokens;
        //
        //Test for  the match of the value aganist the toekn.
        if(super.match(token) && token.name === this.name){
            //
            //They match, return true.
            return true;
        }
        //
        //Compile the error massege.
        result.msg = `Expected ${this.name}`;
        //
        //Set the index position.
        result.index = token.index;
        //
        //Rerune false.They don't match.
        return false;
        
    }
}

//Tokens bae on javaascript data types
class data_type extends tok{
    //
    //returns an instance on call.
    constructor(type,pattern){
        //
        //Construct the parent.
        super(pattern);
        //
        //Set the type.
        this.type = type;
    }
    //
    //Returns true is the value of the charature match the given token.
    match(tokens, result){
        //
        //Deconstruct the tokens to obtain value for testing
        const {token} = tokens;
        //
        //Test for  the match of the value aganist the toekn.
        if(super.match(token) && token.type === this.type){
            //
            //They match, return true.
            return true;
        }
        //
        //Compile the error massege.
        result.msg = `Expected ${this.type}`;
        //
        //Set the index position.
        result.index = token.index;
        //
        //Rerune false.They don't match.
        return false;
        
    }
    //
    //Overide the parent execution method.
    exec(str){
        //
        //Call the super constructor for the parent.
        const match = super.exec(str);
        //
        //Set the value of the match.
        if(match) this.value = match[0];
        //
        //Return the match. 
        return match;
    }
}
//

class comment extends tok{
    //
    //On call, returns an instance.
    constructor(pattern){
        //
        //Construct the parent.
        super(pattern);
    }
}
class space extends char{
    //
    //Retunrs an instace of the class on call.
    constructor(value){
        //
        //Construct the parent.
        super(value);
    }
}
