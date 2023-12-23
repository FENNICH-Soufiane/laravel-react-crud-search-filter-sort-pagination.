<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    //
    public function index(){
        // recuperer les categorie qui on un task
        return Category::has('tasks')->get();
    }
}
