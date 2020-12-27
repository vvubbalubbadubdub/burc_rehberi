import 'package:burc_rehberi/bilgiler/strings.dart';
import 'package:burc_rehberi/modeller/burc.dart';
import 'package:flutter/material.dart';

class AnaSayfa extends StatefulWidget {
  @override
  _AnaSayfaState createState() => _AnaSayfaState();
}

class _AnaSayfaState extends State<AnaSayfa> {
  List<Burc> tumBurclar;

  @override
  Widget build(BuildContext context) {
    tumBurclar = veriKaynaginiHazirla();
    return Scaffold(
        appBar: AppBar(
          title: Text(
            "Burç Rehberi",
          ),
          backgroundColor: Colors.pink,
        ),
        body: listeyihazirla());
  }

  List<Burc> veriKaynaginiHazirla() {
    List<Burc> burclar = [];

    for (int i = 0; i < 12; i++) {
      String kucukREsim = Strings.BURC_ADLARI[i].toLowerCase() + "${i + 1}.png";
      String buyukResim =
          Strings.BURC_ADLARI[i].toLowerCase() + "_buyuk" + "${i + 1}.png";
      Burc eklenecekBurclar = Burc(
          Strings.BURC_ADLARI[i],
          Strings.BURC_TARIHLERI[i],
          Strings.BURC_GENEL_OZELLIKLERI[i],
          kucukREsim,
          buyukResim);
      burclar.add(eklenecekBurclar);
    }
    return burclar;
  }

  Widget listeyihazirla() {
    return ListView.builder(
      itemBuilder: (BuildContext context, int index) {
        return tekSatirBurc(context, index);
      },
      itemCount: tumBurclar.length,
    );
  }

  Widget tekSatirBurc(BuildContext context, int index) {
    Burc listeyeEklenenBurc = tumBurclar[index];
    return Card(
      elevation: 4,
      margin: EdgeInsets.all(10),
      child: Padding(
        padding: EdgeInsets.all(8.0),
        child: ListTile(
          leading: Image.asset(
            "images/" + listeyeEklenenBurc.burcKR,
            width: 44,
            height: 44,
          ),
          title: Text(listeyeEklenenBurc.burcAdi),
        ),
      ),
    );
  }
}
