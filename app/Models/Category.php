<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    public function tasks() {
        // chaque category peut avoir plusieur task
        return $this->hasMany(Task::class);
    }
}
