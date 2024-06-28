import 'package:flutter/cupertino.dart';
import 'package:provider/provider.dart';
import '../services/auth_service.dart';

class AuthProvider extends ChangeNotifier {
  final AuthService _authService = AuthService();
  String? _token;
  String? _error;

  String? get token => _token;
  String? get error => _error;
  
  void removeToken() {
    _token = null;
    notifyListeners();
  }

  Future<void> signup(String username, String email, String password) async {
    try {
      await _authService.signup(username, email, password);
      _setError(null);
    } catch (e) {
      _setError(e.toString());
      rethrow;
    }
  }

  Future<void> signin(String email, String password) async {
    try {
      final response = await _authService.signin(email, password);
      if (response.statusCode == 200) {
        _token = response.data['token'];
        _setError(null);
        print(_token);
        notifyListeners();
      }
    } catch (e) {
      _setError(e.toString());
      return;
    }
  }

  Future<void> verify() async {
    try {
      await _authService.verify(_token!);
      _setError(null);
    } catch (e) {
      _setError(e.toString());
      rethrow;
    }
  }

  void _setError(String? value) {
    _error = value;
    notifyListeners();
  }
}