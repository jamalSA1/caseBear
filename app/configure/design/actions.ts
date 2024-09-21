'use server'

import { db } from "@/db"
import { CaseColor, CaseFinish, CaseMaterial, PhoneModel } from "@prisma/client"

export type saveConfigType = {
  color: CaseColor
  model: PhoneModel
  material: CaseMaterial
  finish: CaseFinish
  configId: string
}

export async function saveConfig({color, model, material, finish, configId}: saveConfigType) {

  await db.configuration.update({
    where: {id: configId},
    data: {color, model, material, finish}
  })
}