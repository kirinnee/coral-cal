{ nixpkgs ? import <nixpkgs> { } }:
let pkgs = rec {
  atomi = (
    with import (fetchTarball "https://github.com/kirinnee/test-nix-repo/archive/refs/tags/v9.0.0.tar.gz");
    {
      inherit pls;
      webstorm = jetbrains.webstorm;
    }
  );
  "Unstable 30th Jul 2022" = (
    with import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/2a93ea177c3d7700b934bf95adfe00c435f696b8.tar.gz") { };
    {
      inherit
        coreutils
        nodejs
        gnugrep
        jq
        nixpkgs-fmt
        shfmt
        shellcheck;
      prettier = nodePackages.prettier;
      pnpm = nodePackages.pnpm;
    }
  );
}; in
with pkgs;
pkgs.atomi // pkgs."Unstable 30th Jul 2022"
