import 'package:flutter/cupertino.dart';
import 'package:go_router/go_router.dart';
import 'screens/master.dart';
import 'screens/signup.dart';
import 'screens/signin.dart';
import 'screens/dashboard.dart';
// import 'screens/details.dart';

final GoRouter router = GoRouter(
  initialLocation: '/',
  routes: <RouteBase>[
    GoRoute(
      path: '/',
      builder: (BuildContext context, GoRouterState state) {
        return const Master();
      },
    ),
    GoRoute(
      path: '/signup',
      builder: (BuildContext context, GoRouterState state) {
        return const Signup();
      },
    ),
    GoRoute(
      path: '/signin',
      builder: (BuildContext context, GoRouterState state) {
        return const Signin();
      },
    ),
    GoRoute(
      path: '/dashboard',
      builder: (BuildContext context, GoRouterState state) {
        return const Dashboard();
      },
    ),
  ],
);
