import { tokenize } from "../tokenization/tokenize";


describe(tokenize, () => {
     it('should create tokens', () => {
         expect(tokenize("global const a = 456")).toStrictEqual([
  { type: 'keyword', value: 'global' },
  { type: 'keyword', value: 'const' },
  { type: 'identifier', value: 'a' },
  { type: 'equality', value: '=' },
  { type: 'Number', value: 456 }
]);
     })
})



