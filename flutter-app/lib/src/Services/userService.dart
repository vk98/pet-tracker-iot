import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_login_signup/src/Models/User.dart';
import 'package:flutter_login_signup/src/Utilities/httpHeaders.dart';
import 'package:flutter_login_signup/src/Utilities/variables.dart';
import 'package:flutter_login_signup/src/loginPage.dart';
import 'package:flutter_login_signup/src/mapsPage.dart';
import 'package:http/http.dart';

class UserService {
  User user;
  UserService._privateConstructor() {
    this.user = new User();
  }
  static final UserService _instance = UserService._privateConstructor();
  Map<String, String> headers;
  factory UserService() {
    return _instance;
  }

  static Future<bool> register(
      BuildContext context, String username, String password) async {
    final response = await post(Uri.parse(BACKEND_URL + '/user/register/'),
        headers: HttpHeaders().getHeaders(),
        body: {"username": username, "password": password}).timeout(
      Duration(seconds: 2),
      onTimeout: () {
        // time has run out, do what you wanted to do
        return null;
      },
    );

    if (response.statusCode == 200) {
      // If the server did return a 200 OK response,
      // then parse the JSON.\
      Navigator.push(
          context, MaterialPageRoute(builder: (context) => LoginPage()));
      return true;
    } else {
      // If the server did not return a 200 OK response,
      // then throw an exception.
      return false;
    }
  }

  Future<bool> login(
      BuildContext context, String username, String password) async {
    final response = await post(Uri.parse(BACKEND_URL + '/user/login/'),
        headers: HttpHeaders().getHeaders(),
        body: {"username": username, "password": password}).timeout(
      Duration(seconds: 2),
      onTimeout: () {
        // time has run out, do what you wanted to do
        return null;
      },
    );

    if (response.statusCode == 200) {
      // If the server did return a 200 OK response,
      // then parse the JSON.\
      var data = jsonDecode(response.body);
      String token = data["token"];
      user.id = data["id"];
      user.username = data["username"];
      HttpHeaders().updateAuthHeader(token);
      Navigator.pushReplacement(
          context, MaterialPageRoute(builder: (context) => MapsPage()));
      return true;
    } else {
      // If the server did not return a 200 OK response,
      // then throw an exception.
      return false;
    }
  }


}
