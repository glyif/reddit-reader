#!/bin/bash

if [ -z "$1" ];

  then
    printf "\n"
    echo "Usage:"
    echo "    $0 -b or --backend for Backend Dev Server"
    echo "    $0 -f or --frontend for Frontend Dev Server"

  else

    case "$1" in
      -b | --backend)
          echo "Check Backend Server at http://localhost:3030"
          echo "Check  Debugger at http://localhost:9229"
          npm start
        ;;

      -f | --frontend)
        printf "\n"
        echo "Check Frontend Server at http://localhost:3000"
        printf "\n"
        cd frontend && ./dev-server.sh
        ;;
      *)

        printf "\n"
        echo "Usage:"
        echo "    $0 -b or --backend for Backend Dev Server"
        echo "    $0 -f or --frontend for Frontend Dev Server"
        ;;
    esac
fi
