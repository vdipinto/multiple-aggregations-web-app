export function getValueFromPath(obj, path) {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  }
  
  export function groupByFields(data, fields) {
    if (fields.length === 0) return data;
    
    //let use an array destructuring with the rest operator, so we can get the first field and the rest of the fields and group by the first field
    const [field, ...restFields] = fields;
  
    //let's use a for loop to group by the first field
    const grouped = {};
    for (const record of data) {
        
        //let's use the getValueFromPath function to get the value of the field from the record
        const key = getValueFromPath(record, field);
      // in case the key is not found, as we expect first time to be an empty object, we just inizialied it, we create an empty array
      if (!grouped[key]) grouped[key] = [];
      //let's push the record to the array
      grouped[key].push(record);
    }
  
    const result = {};
    for (const key in grouped) {
      result[key] = groupByFields(grouped[key], restFields);
    }
  
    return result;
  }
  
  //receive a grouped object and sum the hours for each key
  export function sumNestedHours(grouped) {
    //let's use a for loop to sum the hours for each key, we use isArray to check if the grouped is an array
    if (Array.isArray(grouped)) {
    //let's use a reduce to sum the hours for each item in the array
      return grouped.reduce((sum, item) => sum + item.hours, 0);
    }
  
    //let's create an object to store the result
    const result = {};
    //it iterates over the grouped object and calls the sumNestedHours function for each key
    for (const key in grouped) {
      result[key] = sumNestedHours(grouped[key]);
    }
  
    return result;

    /*

    One Level:

    example:
    {
        "project1": {
            "employee1": 10,
            "employee2": 20
        },
    }

    Two Levels:

    groupedEmpProj = {
  "Mario": {
    "Mars Rover": [
      { employee:{name:"Mario"}, project:{name:"Mars Rover"}, hours:5, ... },
      { employee:{name:"Mario"}, project:{name:"Mars Rover"}, hours:3, ... }
    ],
    "Manhattan": [
      { employee:{name:"Mario"}, project:{name:"Manhattan"},  hours:2, ... }
    ]
  },
  "Giovanni": {
    "Manhattan": [
      { employee:{name:"Giovanni"}, project:{name:"Manhattan"}, hours:3, ... },
      { employee:{name:"Giovanni"}, project:{name:"Manhattan"}, hours:4, ... }
    ]
  },
  "Lucia": {
    "Mars Rover": [
      { employee:{name:"Lucia"}, project:{name:"Mars Rover"}, hours:3, ... }
    ]
  }
};
    */
  }
  