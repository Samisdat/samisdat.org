'use client'
import { useEffect } from 'react'
import { initScholionPin } from '@samisdat/scholion/pin'

export function ScholionController() {
    useEffect(() => initScholionPin(), [])
    return null
}
