{ nixpkgs ? import <nixpkgs> { } }:
let pkgs = import ./packages.nix { inherit nixpkgs; }; in
with pkgs;
{
  system = [
    coreutils
    gnugrep
    jq
  ];

  dev = [
    pls
    nodejs
    pnpm
    webstorm
  ];

  lint = [
    nixpkgs-fmt
    prettier
    shfmt
    shellcheck
  ];

}
