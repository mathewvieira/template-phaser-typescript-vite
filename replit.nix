{ pkgs }: {
	deps = [
    pkgs.yarn
    pkgs.nano
    pkgs.openssh
    pkgs.nodePackages.prettier
    pkgs.nodePackages.typescript
    pkgs.nodePackages.typescript-language-server
  ];
}