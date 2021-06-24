import 'dart:convert';
import 'package:flutter_login_signup/src/Services/userService.dart';
import 'package:flutter_login_signup/src/Utilities/httpHeaders.dart';
import 'package:flutter_login_signup/src/Utilities/variables.dart';
import 'package:flutter_login_signup/src/Models/Location.dart';
import 'package:http/http.dart';


dynamic getLocation() async {
  final response = await get(Uri.parse(BACKEND_URL + '/location/' + UserService().user.id),
        headers: HttpHeaders().getHeaders()).timeout(
    Duration(seconds: 2),
    onTimeout: () {
      // time has run out, do what you wanted to do
      return null;
    },
  );

  if (response.statusCode == 200) {
    // If the server did return a 200 OK response,
    // then parse the JSON.\
    List<dynamic> data = jsonDecode(response.body).toList();
    return (data).map((locationData) => extractLocation(locationData));
  } else {
    // If the server did not return a 200 OK response,
    // then throw an exception.
    Location();
  }
}

Location extractLocation(dynamic locationData) {
  Location loc = Location();
  loc.lat = double.parse(locationData['lat'].toString());
  loc.lng = double.parse(locationData['lng'].toString());
  loc.userId = locationData['userId'];
  loc.trackObject = locationData['trackObject'];
  return loc;
}