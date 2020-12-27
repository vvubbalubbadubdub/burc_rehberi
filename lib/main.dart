import 'package:flutter/material.dart';

import 'ekranlar/ana_sayfa.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "Burç Rehberi",
      debugShowCheckedModeBanner: false,
      home: AnaSayfa(),
    );
  }
}
