# Api Contracts 

Every CRUD operation should return following object 

```
# GraphQl types convention
TypeNameResponse {
error: String
TypeNames: [TypeName]
}

```

```js

const typeNameResponce = {
    error: 'Error_message',
    typeNames: [typeNamePayload1,typeNamePayload2]
}

```

