module.exports = {
    rules: {
      "no-restricted-syntax": [
        "error",
        { selector: "CallExpression[callee.name='cookies'] MemberExpression[property.name='get']", message: "Nutze getCookie()" },
        { selector: "CallExpression[callee.name='headers'] MemberExpression[property.name='get']", message: "Nutze getHeader()" }
      ]
    }
  };