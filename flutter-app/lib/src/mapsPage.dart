import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_login_signup/src/Services/locationService.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class MapsPage extends StatefulWidget {
  MapsPage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _MapsPageState createState() => _MapsPageState();
}

class _MapsPageState extends State<MapsPage> {
  
  static final LatLng _kMapCenter =
      LatLng(42, 23);

  static final CameraPosition _kInitialPosition =
      CameraPosition(target: _kMapCenter, zoom: 10.0, tilt: 0, bearing: 0);

  List<Marker> markers = [];
  Timer timer;
  @override
  void initState() {
    super.initState();
    timer = Timer.periodic(Duration(seconds: 5), (Timer t) => checkForNewCoords());
  }

  @override
  void dispose() {
    timer?.cancel();
    super.dispose();
  }

  checkForNewCoords() {
    getLocation().then((locations) => 
      setState(() { 
        markers = locations.map((location) => Marker(
          markerId: MarkerId("dog"),
          position: LatLng(location.lat, location.lng),
        ));
      })
    );
  }

  @override
  Widget build(BuildContext context) { 
    return Scaffold(
      appBar: AppBar(
        title: Text('Trackers'),
      ),
      body: GoogleMap(
        initialCameraPosition: _kInitialPosition,
        markers: markers.toSet(),
      ),
    );
  }
}
