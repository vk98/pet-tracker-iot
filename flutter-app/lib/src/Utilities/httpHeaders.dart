class HttpHeaders {
  HttpHeaders._privateConstructor() {
    headers = new Map<String, String>();
    headers.addEntries([MapEntry("Authorization", "")]);
  }

  static final HttpHeaders _instance = HttpHeaders._privateConstructor();
  Map<String, String> headers;
  factory HttpHeaders() {
    return _instance;
  }

  Map<String, String> getHeaders() {
    return headers;
  }

  void updateAuthHeader(String token){
    headers["Authorization"] = "Bearer " + token;
  }
}