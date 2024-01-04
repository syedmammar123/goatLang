export const identifyToken = (stack,object) => {

      switch(object.type){
        case 'identifier':
            return {
                type: "Identifier",
                name: object.value,
              }
            break;
        case 'string':
            return {
                type: "StringLiteral",
                value: object.value,
              }
            break;
        case 'Number':
            return {
                type: "NumericLiteral",
                value: object.value,
              }
            break;
        case 'boolean':
            return {
                type: "BooleanLiteral",
                value: object.value,
              }
            break;
        default:
            return {
                type: object.type,
                value: object.value,
              }
            break;
      }

    
}