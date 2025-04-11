export interface Pessoa {
  id?: string;
  nome: string;
  sexo: string;
  cpf: string;
  altura: number;
  peso: number;
  dataNascimento: Date | string; // Pode ser Date ou string dependendo da API
}
