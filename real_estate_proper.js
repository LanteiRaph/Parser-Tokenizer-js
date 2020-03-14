//
//Goal: Develop a logical flow for the real estate mutall service.
//
//Define the registration process. ote that labels are upper case (as in Prolog)
//Lower cased names refer to entities. An entoty expands like this:-
//Entity = service_entity(Entity.namee, [service_attribute, ...]
//This ius a branch service.
//Register = [Unit, picture];
////
////Define the unit. entoty_select is a keyword. It selkects one of the 
//Unit = entity_select(unit, [suite, flat, house, plot, retail_shop]);
//
//
suite = new service_entity("suite");
flat = new service_entity("flat");
house = new service_entity("house");
plot = new service_entity("plot");
retail_shop = new service_entity("shop");
//
unit = new switch_('unit');
//
Register = new branch("Register For a Service",[unit, new service_entity('picture')]);

