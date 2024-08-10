{
  description = "A minimal Next.js flake";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
        nativeBuildInputs = with pkgs; [
          nodejs_20
          pnpm
        ];
      in {
        devShells.default = pkgs.mkShell {
          inherit nativeBuildInputs;

          shellHook = ''
            echo "Development environment for Next.js project"
          '';
        };

        # Optional: Define a package for building the Next.js project
        packages.nextjs = pkgs.stdenv.mkDerivation {
          name = "nextjs-hello-world";
          src = ./.;
          nativeBuildInputs = [ pkgs.nodejs_20 pkgs.pnpm ];

          buildPhase = ''
            pnpm install
            pnpm run build
          '';

          installPhase = ''
            mkdir -p $out
            cp -r . $out/
          '';
        };
      }
    );
}
