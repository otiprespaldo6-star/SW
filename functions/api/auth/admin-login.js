/**
 * Cloudflare Pages Function: /api/auth/admin-login
 * Validates MASTER credentials strictly in the serverless backend.
 */

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const { username, password } = body;

    const MASTER_USER = env.MASTER_USERNAME || 'MASTER';
    const MASTER_PASS = env.MASTER_PASSWORD || 'xyz19481940';

    if (!username || !password) {
      return new Response(
        JSON.stringify({ success: false, error: 'Usuario y clave requeridos.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (String(username).trim().toUpperCase() === MASTER_USER && String(password).trim() === MASTER_PASS) {
      return new Response(
        JSON.stringify({
          success: true,
          token: `cf-jwt-master-${Date.now()}`,
          user: {
            id: 'admin-master',
            firstName: 'MASTER',
            lastName: 'Superadmin',
            fullName: 'MASTER Superadmin',
            emailOrPhone: 'master@styledbywilma.com',
            role: 'superadmin',
            status: 'active',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
            authProvider: 'master',
            createdAt: '2026-01-01',
            lastLogin: new Date().toISOString(),
            wardrobeCount: 0,
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Credenciales de Superadmin incorrectas.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: 'Error interno en el servidor.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
