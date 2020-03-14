Flow = DIRECTIVES, STATEMENTS

STATEMENTS = STATEMENT+
DIRECTIVES = DIRECTIVE+
DIRECTIVE = string(value)
STATEMENT = symbol(LABEL) equal SERVICE semicolon -> service(LABEL, SERVICE)
LABEL = String(Value)
SERVICE =  
        entity_select lbracket entity comma follow_up rbracket -> entity(entity, service_attribute(follow_up))
        lsbracket SERVICES rsbraket -> branch(SERVICES)
