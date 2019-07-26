function discoverSchemaProps(schema, source, callback) {
  Object.keys(source).map(key => {
        callback(key, source[key], schema[key]);
    }
  );
}

module.exports = {discoverSchemaProps};
