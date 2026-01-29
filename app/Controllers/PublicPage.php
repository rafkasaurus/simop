<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\PkptProgramModel;

class PublicPage extends BaseController
{
    protected $pkptModel;

    public function __construct()
    {
        $this->pkptModel = new PkptProgramModel();
    }

    public function index()
    {
        // Ambil data yang dipublish saja
        $data['programs'] = $this->pkptModel
            ->where('is_published', 1)
            ->orderBy('tgl_mulai', 'DESC')
            ->findAll();

        // Hitung statistik sederhana untuk ditampilkan di dashboard publik
        $data['stats'] = [
            'total' => $this->pkptModel->where('is_published', 1)->countAllResults(),
            'selesai' => $this->pkptModel->where('is_published', 1)->where('status', 'selesai')->countAllResults(),
            'berjalan' => $this->pkptModel->where('is_published', 1)->where('status', 'proses')->countAllResults(),
        ];

        return view('public/landing', $data);
    }

    public function widget()
    {
        // Widget khusus menampilkan yang sedang berjalan (ON PROGRESS) atau sesuai request
        // Default: Tampilkan semua yang publish, tappi layout minimalis

        $data['programs'] = $this->pkptModel
            ->where('is_published', 1)
            ->where('status !=', 'batal') // Contoh filter
            ->orderBy('tgl_mulai', 'DESC')
            ->findAll(10); // Limit 10 untuk widget

        return view('public/widget', $data);
    }
}
