<?php

/*
 * How to open this project and works fine
 * 1 - run => npm run watch -> to run the projects from js and read all changes immediately
 * 2 - run -> redis server from programFiles
 * 3 - run -> laravel-echo-server start
 * */

namespace App\Http\Controllers;

use Illuminate\Http\Request;
class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        return view('home');
    }
}
