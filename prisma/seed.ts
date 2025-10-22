import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Categorias
  const cat1 = await prisma.categoria.upsert({
    where: { nome: 'Lanches' },
    update: {},
    create: { nome: 'Lanches' }
  });
  const cat2 = await prisma.categoria.upsert({
    where: { nome: 'Bebidas' },
    update: {},
    create: { nome: 'Bebidas' }
  });

  // Pratos
  const p1 = await prisma.prato.create({
    data: { nome: 'Hambúrguer Clássico', descricao: 'Pão, carne, queijo e salada', preco: 24.90, categoriaId: cat1.id }
  });
  const p2 = await prisma.prato.create({
    data: { nome: 'Suco de Laranja', descricao: 'Natural, sem açúcar', preco: 9.50, categoriaId: cat2.id }
  });

  // Pedido com itens
  await prisma.pedido.create({
    data: {
      itens: {
        create: [
          { pratoId: p1.id, quantidade: 2 },
          { pratoId: p2.id, quantidade: 1 }
        ]
      }
    }
  });
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
