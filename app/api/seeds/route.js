import { NextResponse } from 'next/server';
import { database } from '@/utils/dbServer';
console.log('Route module loaded');

// GET handler
export async function GET(request) {
  console.log('fetching');

  try {
    // Log request details
    console.log('GET /api/seeds request received', {
      url: request.url,
      hasSearchParams: request.url.includes('?')
    });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      console.log('Fetching single strain:', id);
      try {
        const strain = await database.get(`strain_${id}`);
        console.log('Found strain:', {
          id: strain._id,
          rev: strain._rev,
          type: strain.type
        });
        
        if (!strain) {
          console.log('Strain not found:', id);
          return NextResponse.json({ error: 'Strain not found' }, { status: 404 });
        }
        return NextResponse.json(strain);
      } catch (dbError) {
        console.error('Database error fetching single strain:', {
          error: dbError.message,
          id: id
        });
        return NextResponse.json({ 
          error: 'Database error', 
          details: process.env.NODE_ENV === 'development' ? dbError.message : undefined 
        }, { status: 500 });
      }
    }

    console.log('Fetching all strains...');
    try {
     
      // Get all documents
      const response = await database.list({ include_docs: true });
      console.log('Raw database response:', {
        total_rows: response.total_rows,
        offset: response.offset,
        has_rows: !!response.rows?.length
      });

      const strains = response.rows
        .map(row => row.doc)
        .filter(doc => doc && doc.type === 'strain');

      console.log('Filtered strains:', {
        totalDocs: response.rows.length,
        strainsFound: strains.length,
        sampleStrain: strains[0] ? {
          id: strains[0]._id,
          type: strains[0].type,
          hasTitle: !!strains[0].title
        } : null
      });

      return NextResponse.json(strains);
    } catch (dbError) {
      console.error('Database error fetching all strains:', {
        error: dbError.message,
        code: dbError.code,
        statusCode: dbError.statusCode
      });
      return NextResponse.json({ 
        error: 'Database error', 
        details: process.env.NODE_ENV === 'development' ? dbError.message : undefined 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('General error in seeds API:', {
      error: error.message
    });
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    }, { status: 500 });
  }
}

// PUT handler
export async function PUT(request) {
  try {
    const strain = await request.json();
    if (!strain || !strain.id) {
      return NextResponse.json({ error: 'Invalid strain data' }, { status: 400 });
    }

    // Try to get existing document for _rev
    let existing;
    try {
      existing = await database.get(`strain_${strain.id}`);
    } catch (e) {
      console.log('Document does not exist yet, creating new:', strain.id);
    }

    try {
      const result = await database.insert({
        ...strain,
        _id: `strain_${strain.id}`,
        _rev: existing?._rev,
        type: 'strain'
      });
      return NextResponse.json(result);
    } catch (dbError) {
      console.error('Database error updating strain:', {
        error: dbError.message,
        id: strain.id
      });
      return NextResponse.json({ 
        error: 'Database error', 
        details: process.env.NODE_ENV === 'development' ? dbError.message : undefined 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('General error in PUT handler:', {
      error: error.message
    });
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    }, { status: 500 });
  }
}
