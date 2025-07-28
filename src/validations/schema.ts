import { z } from "zod";

// ポジションを追加する時のForm
export const addPositionSchema = z.object({
  position: z
    .string()
    .min(1, {message: "ポジション名を入力してください"})
    .max(15,{message: "15文字以内にしてください"})  
}) 
export type addPositionSchemaTs = z.infer<typeof addPositionSchema>


// アイテムを追加する時のForm
export const addItemSchema = z.object({
  item: z
    .string()
    .min(1, {message: "アイテム名を入力してください"})
    .max(15,{message: "15文字以内にしてください"}),
  number: z.number().min(1,{message: "個数を入力してください"}),
  startDate: z.string().min(1, {message: "日付は必須です"}),
  endDate: z.string().min(1, {message: "日付は必須です"}),
})
export type addItemSchemaTs = z.infer<typeof addItemSchema>


// ポジションを変更する時のForm
export const editPositionSchema = z.object({
  area: z
    .string()
    .min(1, {message: "エリア名を選択してください"}),
  position: z
    .string()
    .min(1, {message: "ポジション名を選択してください"})    
})
export type editPositionSchemaTs = z.infer<typeof editPositionSchema> 

// アイテムの内容を変更する時のForm

export const editItemSchema = z.object({
  area: z
    .string()
    .min(1, {message: "エリア名を選択してください"}),
  position: z
    .string()
    .min(1, {message: "ポジション名を選択してください"}),
  item: z
    .string()
    .min(1, {message: "アイテム名を入力してください"}),
  number: z.coerce.number()
    .min(1, {message: "個数は1以上で入力してください"})
    .int({message: "個数は整数で入力してください"})
    .positive({message: "個数は正数で入力してください"}), 
  startDate: z
    .string(),
  endDate: z
    .string(),
})
export type editItemSchemaTs = z.infer<typeof editItemSchema> 

