"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search, Pencil, Trash2, UserPlus, Eye, EyeOff, Users, Home } from "lucide-react";
import Card from "@/components/shared/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import AdminNavbar from "@/components/admin/AdminNavbar";

// Zod schema for form validation
const userSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  role: z.enum(["student", "teacher", "admin"], {
    required_error: "Rol seçin",
  }),
  active: z.boolean().default(true),
});

type UserFormData = z.infer<typeof userSchema>;

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
  active: boolean;
  createdAt: string;
}

const initialMockUsers: AdminUser[] = [
  { id: "u1", name: "Ali Veli", email: "ali@example.com", role: "student", active: true, createdAt: "2024-01-15" },
  { id: "u2", name: "Ayşe Yılmaz", email: "ayse@example.com", role: "teacher", active: true, createdAt: "2024-01-10" },
  { id: "u3", name: "Mehmet Kaya", email: "mehmet@example.com", role: "student", active: false, createdAt: "2024-01-05" },
  { id: "u4", name: "Fatma Demir", email: "fatma@example.com", role: "admin", active: true, createdAt: "2024-01-01" },
];

export default function AdminUsersPage() {
  const [q, setQ] = useState("");
  const [users, setUsers] = useState<AdminUser[]>(initialMockUsers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  
  const filteredUsers = useMemo(() => 
    users.filter(u => 
      u.name.toLowerCase().includes(q.toLowerCase()) || 
      u.email.toLowerCase().includes(q.toLowerCase())
    ), [users, q]
  );

  // Form for adding new user
  const addForm = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "student",
      active: true,
    },
  });

  // Form for editing user
  const editForm = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  // Add new user
  const handleAddUser = (data: UserFormData) => {
    const newUser: AdminUser = {
      id: `u${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUsers(prev => [newUser, ...prev]);
    setIsAddDialogOpen(false);
    addForm.reset();
    toast.success("Kullanıcı başarıyla eklendi");
  };

  // Edit user
  const handleEditUser = (data: UserFormData) => {
    if (!selectedUser) return;
    
    setUsers(prev => prev.map(user => 
      user.id === selectedUser.id 
        ? { ...user, ...data }
        : user
    ));
    setIsEditDialogOpen(false);
    setSelectedUser(null);
    editForm.reset();
    toast.success("Kullanıcı başarıyla güncellendi");
  };

  // Delete user
  const handleDeleteUser = () => {
    if (!selectedUser) return;
    
    setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
    toast.success("Kullanıcı başarıyla silindi");
  };

  // Toggle user active status
  const handleToggleActive = (user: AdminUser) => {
    setUsers(prev => prev.map(u => 
      u.id === user.id 
        ? { ...u, active: !u.active }
        : u
    ));
    toast.success(`Kullanıcı ${!user.active ? 'aktif' : 'pasif'} edildi`);
  };

  // Open edit dialog
  const openEditDialog = (user: AdminUser) => {
    setSelectedUser(user);
    editForm.reset({
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active,
    });
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (user: AdminUser) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  // Export users
  const handleExport = () => {
    const csvContent = [
      ["İsim", "E-posta", "Rol", "Durum", "Oluşturulma Tarihi"],
      ...filteredUsers.map(user => [
        user.name,
        user.email,
        user.role,
        user.active ? "Aktif" : "Pasif",
        user.createdAt
      ])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "kullanicilar.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Kullanıcılar dışa aktarıldı");
  };

  return (
    <div className="min-h-screen">
      <AdminNavbar 
        title="Kullanıcı Yönetimi"
        subtitle="Sistem kullanıcılarını yönetin"
        icon={<Users className="h-5 w-5 text-white" />}
        breadcrumb={{
          items: [
            {
              label: "Admin",
              href: "/admin",
              icon: <Home className="h-3 w-3" />
            },
            {
              label: "Kullanıcılar",
              active: true
            }
          ]
        }}
      />

      {/* Main Content */}
      <div className="pt-24">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                className="gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Yeni Kullanıcı
              </Button>
            </div>
          </div>

      <Card className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input 
              value={q} 
              onChange={e => setQ(e.target.value)} 
              placeholder="İsim veya e-posta ile ara" 
              className="pl-9" 
            />
          </div>
          <Button variant="outline" onClick={handleExport}>
            Dışa Aktar
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 border-b">
                <th className="py-3 px-3 font-medium">İsim</th>
                <th className="py-3 px-3 font-medium">E-posta</th>
                <th className="py-3 px-3 font-medium">Rol</th>
                <th className="py-3 px-3 font-medium">Durum</th>
                <th className="py-3 px-3 font-medium">Oluşturulma</th>
                <th className="py-3 px-3 text-right font-medium">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="py-3 px-3 font-medium text-gray-900 dark:text-gray-100">
                    {user.name}
                  </td>
                  <td className="py-3 px-3 text-gray-600 dark:text-gray-400">
                    {user.email}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' :
                      user.role === 'teacher' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                      'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                    }`}>
                      {user.role === 'admin' ? 'Yönetici' : 
                       user.role === 'teacher' ? 'Öğretmen' : 'Öğrenci'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => handleToggleActive(user)}
                      className={`text-xs px-2 py-1 rounded-full font-medium transition-colors ${
                        user.active 
                          ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/30" 
                          : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
                      }`}
                    >
                      {user.active ? "Aktif" : "Pasif"}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-gray-600 dark:text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="gap-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
                        onClick={() => openEditDialog(user)}
                      >
                        <Pencil className="h-3 w-3" />
                        Düzenle
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        className="gap-1"
                        onClick={() => openDeleteDialog(user)}
                      >
                        <Trash2 className="h-3 w-3" />
                        Sil
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>Kullanıcı bulunamadı</p>
            </div>
          )}
        </div>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Yeni Kullanıcı Ekle</DialogTitle>
            <DialogDescription>
              Sisteme yeni bir kullanıcı ekleyin.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={addForm.handleSubmit(handleAddUser)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">İsim</label>
              <Input
                {...addForm.register("name")}
                placeholder="Kullanıcı adı"
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:ring-primary"
              />
              {addForm.formState.errors.name && (
                <p className="text-sm text-red-600 dark:text-red-400">{addForm.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">E-posta</label>
              <Input
                {...addForm.register("email")}
                type="email"
                placeholder="ornek@email.com"
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:ring-primary"
              />
              {addForm.formState.errors.email && (
                <p className="text-sm text-red-600 dark:text-red-400">{addForm.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Rol</label>
              <Select
                value={addForm.watch("role")}
                onValueChange={(value) => addForm.setValue("role", value as any)}
              >
                <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                  <SelectValue placeholder="Rol seçin" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                  <SelectItem value="student" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">Öğrenci</SelectItem>
                  <SelectItem value="teacher" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">Öğretmen</SelectItem>
                  <SelectItem value="admin" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">Yönetici</SelectItem>
                </SelectContent>
              </Select>
              {addForm.formState.errors.role && (
                <p className="text-sm text-red-600 dark:text-red-400">{addForm.formState.errors.role.message}</p>
              )}
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => setIsAddDialogOpen(false)}
              >
                İptal
              </Button>
              <Button 
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Kullanıcı Ekle
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Kullanıcı Düzenle</DialogTitle>
            <DialogDescription>
              Kullanıcı bilgilerini güncelleyin.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={editForm.handleSubmit(handleEditUser)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">İsim</label>
              <Input
                {...editForm.register("name")}
                placeholder="Kullanıcı adı"
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:ring-primary"
              />
              {editForm.formState.errors.name && (
                <p className="text-sm text-red-600 dark:text-red-400">{editForm.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">E-posta</label>
              <Input
                {...editForm.register("email")}
                type="email"
                placeholder="ornek@email.com"
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:ring-primary"
              />
              {editForm.formState.errors.email && (
                <p className="text-sm text-red-600 dark:text-red-400">{editForm.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Rol</label>
              <Select
                value={editForm.watch("role")}
                onValueChange={(value) => editForm.setValue("role", value as any)}
              >
                <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                  <SelectValue placeholder="Rol seçin" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                  <SelectItem value="student" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">Öğrenci</SelectItem>
                  <SelectItem value="teacher" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">Öğretmen</SelectItem>
                  <SelectItem value="admin" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">Yönetici</SelectItem>
                </SelectContent>
              </Select>
              {editForm.formState.errors.role && (
                <p className="text-sm text-red-600 dark:text-red-400">{editForm.formState.errors.role.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Durum</label>
              <Select
                value={editForm.watch("active") ? "active" : "inactive"}
                onValueChange={(value) => editForm.setValue("active", value === "active")}
              >
                <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                  <SelectValue placeholder="Durum seçin" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                  <SelectItem value="active" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">Aktif</SelectItem>
                  <SelectItem value="inactive" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">Pasif</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => setIsEditDialogOpen(false)}
              >
                İptal
              </Button>
              <Button 
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Güncelle
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Kullanıcıyı Sil</DialogTitle>
            <DialogDescription>
              Bu işlem geri alınamaz. <strong>{selectedUser?.name}</strong> kullanıcısını silmek istediğinizden emin misiniz?
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              İptal
            </Button>
            <Button 
              variant="destructive" 
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDeleteUser}
            >
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </div>
      </div>
    </div>
  );
}



