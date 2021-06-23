class Location {
  String _id;
  String trackObject;
  double lat;
  double lng;
  String userId;

  static Location fromJson(dynamic data) {
    Location location = new Location();
    location.lat = data["lat"];
    location.lng = data["lng"];
    location.trackObject = data["trackObject"];
    location.userId = data["userId"];
    return location;
  }
}