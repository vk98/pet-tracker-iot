class Location {
  String _id;
  String trackObject;
  double lat;
  double lng;
  String userId;

  static Location fromJson(dynamic data) {
    Location location = new Location();
    location.lat = double.parse(data["lat"].toString());
    location.lng = double.parse(data["lng"].toString());
    location.trackObject = data["trackObject"];
    location.userId = data["userId"];
    return location;
  }
}