import 'package:flutter/cupertino.dart';
import 'package:go_router/go_router.dart';

class Master extends StatelessWidget {
  const Master({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return CupertinoPageScaffold(
      navigationBar: const CupertinoNavigationBar(
        middle: Text('Master'),
      ),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(CupertinoIcons.check_mark_circled_solid,
                size: 100.0, color: CupertinoColors.systemBlue),
            const SizedBox(height: 20.0),
            CupertinoButton(
              onPressed: () => context.go('/signin'),
              color: CupertinoColors.systemBlue,
              child: const Text('Sign In',
                  style: TextStyle(color: CupertinoColors.white)),
            ),
            const SizedBox(height: 20.0),
            CupertinoButton(
              onPressed: () => context.go('/signup'),
              color: CupertinoColors.systemBrown,
              child: const Text('Sign Up',
                  style: TextStyle(color: CupertinoColors.white)),
            ),
          ],
        ),
      ),
    );
  }
}
