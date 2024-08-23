{ pkgs }: {
	deps = [
    pkgs.yarn
    pkgs.nodePackages.typescript
    pkgs.nodePackages.typescript-language-server
  ];
}