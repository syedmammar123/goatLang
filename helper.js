export const identifyToken = (stack,object) => {
    let property = {
        type: "ObjectProperty",
        key: stack.pop(),
      };

      switch(object.type){
        case 'identifier':
            property.value = {
                type: "Identifier",
                name: object.value,
              }
            break;
        case 'string':
            property.value = {
                type: "StringLiteral",
                value: object.value,
              }
            break;
        case 'Number':
            property.value = {
                type: "NumericLiteral",
                value: object.value,
              }
            break;
        case 'boolean':
            property.value = {
                type: "BooleanLiteral",
                value: object.value,
              }
            break;
        default:
            property.value = {
                type: object.type,
                value: object.value,
              }
            break;
      }

      return property;
}