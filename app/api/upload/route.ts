import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { error: 'El archivo debe ser un CSV' },
        { status: 400 }
      );
    }

    // Read file content
    const text = await file.text();

    // Return the CSV text for client-side parsing
    // (We parse on client side to have better control over the UI feedback)
    return NextResponse.json({
      success: true,
      data: text,
    });
  } catch (error) {
    console.error('Error processing upload:', error);
    return NextResponse.json(
      { error: 'Error al procesar el archivo' },
      { status: 500 }
    );
  }
}
