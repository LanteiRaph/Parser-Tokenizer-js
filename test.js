//
var dbase = null;

//Let stringbe the test string.
//const $str = 'do three time while in a switch what a do will do in the while now e.g, 45 is number "string { +24.6 }" -24.5';
(async()=>{
    //
    //Lantei's work
    //
    //Parse the text pointed by the given url to a list of static statements
    const flow = await parse_url('http://localhost/v3_rental_services/real_estate.js');
    //
    //Get teh structure of the database to use
    //Dfune the login crtedentials of the required database
    const args = {
        name:'real_estate',
        username:'root',
        password:''
    };
    //
    //Fetch from the database structure from the server.
    dbase = await mutall.fetch('database', 'export_structure', args);
    //
    //Use the database to simplify the static services to the singlke service -- register
    //Take care of cyvlic flows.
    const register = simplify('Register', [],[], flow.statements);
    //
    //Inputs frm Camilus
    //
    //Set the logical parents of all the grandcchildern of register
    register.set_parent(null);
    //
    const parent = document.querySelector('#nav');
    //
    //Set the the view of this branch and that of all her 
    //grand children
    register.set_view_and_id(parent, 0);
                
})();


