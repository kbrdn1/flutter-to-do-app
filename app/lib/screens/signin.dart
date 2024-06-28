import 'package:flutter/cupertino.dart';
import 'package:flutter/scheduler.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import 'package:go_router/go_router.dart';

class Signin extends StatefulWidget {
  const Signin({Key? key}) : super(key: key);

  @override
  _SigninState createState() => _SigninState();
}

class _SigninState extends State<Signin> {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final ValueNotifier<String?> errorNotifier = ValueNotifier<String?>(null);

  @override
  void initState() {
    super.initState();
    SchedulerBinding.instance.addPostFrameCallback((_) {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      if (authProvider.token != null) {
        GoRouter.of(context).go('/dashboard');
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return CupertinoPageScaffold(
      backgroundColor: CupertinoColors.systemGrey6,
      navigationBar: const CupertinoNavigationBar(
        middle: Text('Sign In'),
      ),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(CupertinoIcons.check_mark_circled_solid,
                size: 100.0, color: CupertinoColors.systemBlue),
            const Text('Sign in to your account'),
            const SizedBox(height: 20.0),
            CupertinoTextField(
              controller: emailController,
              placeholder: 'Email',
              padding: const EdgeInsets.all(16.0),
            ),
            const SizedBox(height: 20.0),
            CupertinoTextField(
              controller: passwordController,
              placeholder: 'Password',
              padding: const EdgeInsets.all(16.0),
              obscureText: true,
            ),
            const SizedBox(height: 20.0),
            ValueListenableBuilder<String?>(
              valueListenable: errorNotifier,
              builder: (context, error, child) {
                return error != null
                    ? Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16.0),
                        child: Text(error,
                            style: const TextStyle(
                                color: CupertinoColors.systemRed)),
                      )
                    : Container();
              },
            ),
            const SizedBox(height: 20.0),
            Consumer<AuthProvider>(
              builder: (context, authProvider, child) {
                return CupertinoButton(
                  onPressed: () async {
                    final email = emailController.text;
                    final password = passwordController.text;
                    print(email);
                    print(password);
                    if (email.isEmpty || password.isEmpty) {
                      errorNotifier.value = 'Email and password are required';
                      return;
                    }
                    errorNotifier.value = null;
                    try {
                      await authProvider.signin(email, password);
                      if (authProvider.token != null) {
                        GoRouter.of(context).go('/dashboard');
                      }
                    } catch (e) {
                      errorNotifier.value = e.toString();
                    }
                  },
                  color: CupertinoColors.systemBlue,
                  child: const Text('Sign In',
                      style: TextStyle(color: CupertinoColors.white)),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
