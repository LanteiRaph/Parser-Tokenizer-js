//
//Goal: Develop a logical flow for the real estate mutall service.
//
//Define the registration process. ote that labels are upper case (as in Prolog)
//Lower cased names refer to entities. An entoty expands like this:-
//Entity = service_entity(Entity.namee, [service_attribute, ...]
//This ius a branch service.
Register = [Unit, picture];
//
//
picture = service_entity('picture');
//
//Define the unit. entoty_select is a keyword. It selkects one of the 
Unit = service_entity(unit, [suite, flat, house, plot, retail_shop]);


