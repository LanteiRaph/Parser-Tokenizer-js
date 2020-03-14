"registration";
//
//Goal:Develop a flow to map a registration service for the mutall rental.
//
//Lable = a name pointing a a service. defined in firts letter capital.
//Token = an entity name; marked with all lowercase leter.
//
//Defined the regisration lable.
Register = [client, Unit, Target];
//
//Define the rental_unit lable.
Unit = entity_select(unit, [suite, flat, house]);
//
//Defined the target lable.
Target = [agreement, wconnection, econnection, subscription];