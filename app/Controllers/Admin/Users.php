<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\UserModel;

class Users extends BaseController
{
    protected $userModel;

    public function __construct()
    {
        $this->userModel = new UserModel();
    }

    public function index()
    {
        $data['users'] = $this->userModel->findAll();
        return view('admin/users/index', $data);
    }

    public function new()
    {
        return view('admin/users/form', ['user' => null]);
    }

    public function create()
    {
        $rules = [
            'name' => 'required',
            'email' => 'required|valid_email|is_unique[users.email]',
            'password' => 'required|min_length[5]',
            'role' => 'required',
            'irban_unit' => 'required'
        ];

        if (!$this->validate($rules)) {
            return $this->response->setJSON([
                'status' => 'error',
                'messages' => $this->validator->getErrors()
            ]);
        }

        $data = [
            'name' => $this->request->getVar('name'),
            'email' => $this->request->getVar('email'),
            'password' => password_hash($this->request->getVar('password'), PASSWORD_DEFAULT),
            'role' => $this->request->getVar('role'),
            'irban_unit' => $this->request->getVar('irban_unit'),
        ];

        $this->userModel->insert($data);

        return $this->response->setJSON(['status' => 'success']);
    }

    public function edit($id = null)
    {
        $data['user'] = $this->userModel->find($id);
        return view('admin/users/form', $data);
    }

    public function update($id = null)
    {
        // Validation with ignore unique email for current user
        $rules = [
            'name' => 'required',
            'email' => "required|valid_email|is_unique[users.email,id,$id]",
            'role' => 'required',
            'irban_unit' => 'required'
        ];

        // Password is optional on update
        $password = $this->request->getVar('password');
        if (!empty($password)) {
            $rules['password'] = 'min_length[5]';
        }

        if (!$this->validate($rules)) {
            return $this->response->setJSON([
                'status' => 'error',
                'messages' => $this->validator->getErrors()
            ]);
        }

        $data = [
            'name' => $this->request->getVar('name'),
            'email' => $this->request->getVar('email'),
            'role' => $this->request->getVar('role'),
            'irban_unit' => $this->request->getVar('irban_unit'),
        ];

        if (!empty($password)) {
            $data['password'] = password_hash($password, PASSWORD_DEFAULT);
        }

        $this->userModel->update($id, $data);

        return $this->response->setJSON(['status' => 'success']);
    }

    public function delete($id = null)
    {
        $this->userModel->delete($id);
        return $this->response->setJSON(['status' => 'success']);
    }
}
