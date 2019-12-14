import Mock from "mockjs";

const Random = Mock.Random;

export function random(type) {
  type = Random.lower(type);
  switch (type) {
    case "int":
    case "integer":
      return Random.integer(0, 100);
    case "int2":
    case "integer2":
      return Random.integer(-100, 0);
    case "float":
    case "double":
    case "number":
      return Random.float(0, 100, 2, 2);
    case "boolean":
    case "bool":
      return Random.boolean();
    case "string":
    case "str":
      return Random.string("lower", 3, 7);
    case "range":
      return Random.range(5);
    case "date":
      return Random.date();
    case "time":
      return Random.time();
    case "datetime":
      return Random.datetime();
    case "now":
      return Random.now();
    case "image":
    case "face":
      return Random.image();
    case "dataImage":
      return Random.dataImage();
    case "color":
      return Random.color();
    case "cname":
    case "name":
    case "username":
    case "nickname":
      return Random.cname();
    case "mobile":
    case "telephone":
    case "phone":
      return Mock.mock(/^1[385][1-9]\d{8}/);
    case "url":
      return Random.url();
    case "domain":
      return Random.domain();
    case "protocal":
      return Random.protocal();
    case "ip":
      return Random.ip();
    case "email":
      return Random.email();
    case "province":
    case "province_name":
      return Random.province();
    case "city":
    case "city_name":
      return Random.city();
    case "county":
    case "county_name":
      return Random.county();
    case "address":
      return Random.county(true);
    case "zip":
      return Random.zip();
    case "idcard":
      return Random.id();
    case "id":
      return Random.guid();
    default:
      return Mock;
  }
}

export function randomByName(name, type) {
  name = Random.lower(name);
  type = Random.lower(type);
  let arr = ["file", "array", "object", "body"];

  if (arr.indexOf(type) >= 0) {
    return "";
  }

  if (type === "string") {
    if (name.indexOf("url") >= 0) {
      name = "url";
    } else if (name.indexOf("image") >= 0) {
      name = "image";
    }
  } else {
    name = type;
  }

  let str = random(name);
  if (str === Mock) {
    str = random(type);
  }
  return str;
}
