<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;

class Dashboard extends BaseController
{
    public function index()
    {
        return view('admin/dashboard');
    }

    public function stats()
    {
        return view('admin/dashboard_stats');
    }
}
